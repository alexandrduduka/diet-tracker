# Technical Documentation

## Architecture Overview

Diet Tracker is a fully client-side PWA with no backend. All data lives in the browser:

```
Browser
├── React app (SPA, hash router)
├── IndexedDB (Dexie.js)  — meal entries, body measurements
├── localStorage           — user settings (API key, goals, language)
└── Service Worker         — cache-first app shell, offline support

External (online only)
└── Google Gemini API      — meal description → structured JSON
```

There is no server, database server, or authentication system. The app is a static bundle of HTML/JS/CSS deployed to Cloudflare Pages.

---

## Data Layer

### IndexedDB Schema (Dexie.js)

Defined in `src/db/index.ts`.

```typescript
class DietDB extends Dexie {
  meals!: Table<MealEntry>;
  measurements!: Table<BodyMeasurement>;
}

db.version(1).stores({
  meals: '++id, dayKey, timestamp',
  measurements: '++id, dayKey, timestamp',
});
```

Both tables use auto-incrementing integer primary keys. `dayKey` (format: `'yyyy-MM-dd'`) is the primary query index — most reads filter by a set of day keys.

### Data Models

```typescript
// src/types/index.ts

interface MacroNutrients {
  calories: number;   // kcal
  protein: number;    // grams
  fat: number;        // grams
  carbs: number;      // grams
}

interface FoodItem {
  name: string;
  quantity: string;   // human-readable, e.g. "1 medium (~118g)"
  macros: MacroNutrients;
}

interface MealEntry {
  id?: number;
  timestamp: Date;
  dayKey: string;           // "2026-03-04"
  rawInput: string;         // original user text
  foods: FoodItem[];
  totalMacros: MacroNutrients;
  llmConfidence: 'high' | 'medium' | 'low' | 'manual';
  notes?: string;           // LLM caveats or assumptions
}

interface BodyMeasurement {
  id?: number;
  timestamp: Date;
  dayKey: string;
  weight?: number;      // kg
  waist?: number;       // cm
  chest?: number;       // cm
  hips?: number;        // cm
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  notes?: string;
}
```

### Settings (localStorage)

Defined in `src/store/settings.ts`. Storage key: `'dtk_settings'`.

```typescript
interface UserSettings {
  geminiApiKey: string;
  goals: MacroGoals;   // { calories, protein, fat, carbs }
  language: AppLanguage;
  onboardingComplete?: boolean;       // false for new users; true after onboarding or migration
  onboardingProfile?: OnboardingProfile; // stored for future reference
}

interface OnboardingProfile {
  sex: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  activityMultiplier: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  goal: 'lose' | 'maintain' | 'gain';
}

// Defaults
{ calories: 2000, protein: 150, fat: 65, carbs: 250, language: 'en', onboardingComplete: false }
```

`migrateSettings()` in `src/store/settings.ts` is called at app startup (in `main.tsx`). If `dtk_settings` exists in localStorage but lacks `onboardingComplete`, it is set to `true` so existing users don't see the onboarding flow.

### Goal Calculator (`src/lib/goalCalculator.ts`)

Pure functions for calculating macro goals from an `OnboardingProfile`:

- **`calculateBMR(p)`** — Mifflin-St Jeor formula: `10W + 6.25H - 5A + 5` (male) / `-161` (female)
- **`calculateTDEE(p)`** — `BMR × activityMultiplier`
- **`calculateCalorieTarget(p)`** — `TDEE - 400` (lose, min 1200) / `TDEE + 250` (gain) / `TDEE` (maintain)
- **`calculateMacroGoals(p)`** — protein 1.8–2.0g/kg (capped at 40% of cals), fat 28% of cals, carbs remainder
- **`derivedCarbs(calories, protein, fat)`** — `(calories - protein*4 - fat*9) / 4`, min `MIN_CARBS_G`
- **`fatSliderBounds(calories, protein)`** — min=20% of cals÷9, max=45% of cals÷9 limited by `MIN_CARBS_G`
- **`proteinSliderBounds(weightKg)`** — min=0.8g/kg, max=2.5g/kg
- **`MIN_CARBS_G = 20`** — exported constant

Reads always merge stored data over defaults, so new fields added to `DEFAULT_SETTINGS` are automatically available for existing users.

---

## Gemini Integration

`src/lib/gemini.ts`

### Model

`gemini-2.5-flash` with `responseMimeType: 'application/json'`, `maxOutputTokens: 2048`.

- `temperature: 0.1` when no coaching context is provided
- `temperature: 0.4` when `MealContext` is provided (allows more natural coaching phrasing)

> Note: `gemini-2.0-flash` was retired on 2026-03-03. `gemini-2.5-flash` is the current replacement (free tier: 10 RPM, 250–500 RPD). Keep `maxOutputTokens` ≥ 2048 — this model uses internal thinking tokens, and lower values cause truncated JSON → PARSE_ERROR.

### Prompt design

A system prompt instructs the model to return a strict JSON schema:

```json
{
  "foods": [
    {
      "name": "string",
      "quantity": "string (e.g. 1 medium ~118g)",
      "calories": 105,
      "protein": 1.3,
      "fat": 0.4,
      "carbs": 27
    }
  ],
  "confidence": "high | medium | low",
  "notes": "optional string",
  "message": "optional coaching string (only when MealContext is supplied)"
}
```

Rules embedded in the prompt:
- Use USDA reference data
- When quantity is vague, assume typical portion and state it in `quantity`
- `confidence: "high"` = explicit weight given; `"medium"` = typical portion; `"low"` = guesswork
- Never refuse — always return best estimate

### MealContext (coaching)

When the caller provides a `MealContext`, the system prompt is extended with:
- The user's daily goals (kcal / P / C / F)
- Already consumed today
- Remaining today (pre-calculated)

The model is instructed to add a `message` field: 2–3 sentences of friendly, motivational coaching in the app language mentioning specific remaining budget figures. This context is assembled in `Chat.tsx` from `getGoals()` (localStorage) and a live Dexie reduce of today's `totalMacros`.

### Image / multimodal input

`parseMealDescription` accepts an optional `image?: ImageAttachment` parameter:

```typescript
interface ImageAttachment {
  base64: string;   // raw base64 (no data URL prefix)
  mimeType: string; // e.g. "image/jpeg"
}
```

When an image is provided, it is passed to Gemini as an `inlineData` content part alongside any user text. If no text is provided, a default prompt `"Identify the food in this image and estimate the nutrition."` is used. The same JSON schema and post-processing pipeline applies regardless of whether input is text, image, or both.

### Post-processing

After parsing the JSON response, the app runs `validateAndFixCalories`:

```typescript
// If LLM calorie value differs from protein*4 + carbs*4 + fat*9 by more than 10%,
// replace it with the recalculated value
export function validateAndFixCalories(macros: MacroNutrients): MacroNutrients
```

This corrects common LLM rounding errors where the stated calorie count doesn't match the macros.

### Error handling

| Error condition | Thrown as | UI behaviour |
|---|---|---|
| No API key in settings | `'NO_API_KEY'` | Inline setup wizard card in Chat |
| HTTP 429 / quota / rate limit | `'RATE_LIMIT'` | Suggest manual logging or retry |
| HTTP 403 / invalid key | `'INVALID_API_KEY'` | Prompt to check Settings |
| JSON parse failure | `'PARSE_ERROR'` | Show manual fallback |
| Other network/API error | `'API_ERROR: ...'` | Show error message |

Rate limit detection checks both `err.status` (numeric) and `err.message` text for `'resource_exhausted'` and `'quota exceeded'` — the Gemini SDK embeds HTTP status in the message string rather than always exposing it as a numeric property.

### API key setup wizard

When `NO_API_KEY` is thrown, instead of a generic error the Chat page appends a `{ role: 'setup', retryText }` message. This renders as an assistant-style card with:
- "Free, ~30 seconds" framing
- A button that opens `https://aistudio.google.com/app/apikey` in a new tab
- An inline key input with show/hide toggle
- A "Save & continue" button that calls `saveSettings({ geminiApiKey })` and retries the original meal text automatically

---

## Nutrition Utilities

`src/lib/nutrition.ts`

| Function | Description |
|---|---|
| `sumMacros(foods)` | Sum macros across an array of `FoodItem` |
| `addMacros(a, b)` | Add two `MacroNutrients` objects |
| `zeroMacros()` | Return `{ calories:0, protein:0, fat:0, carbs:0 }` |
| `percentOfGoal(consumed, goal)` | `min((consumed/goal)*100, 100)` — capped at 100 |
| `remainingMacro(consumed, goal)` | `max(goal - consumed, 0)` — floor at 0 |
| `recalculateCalories(macros)` | `round(protein*4 + carbs*4 + fat*9)` |
| `validateAndFixCalories(macros)` | Replace calories if off by >10% |
| `roundMacros(macros)` | Calories → integer; protein/fat/carbs → 1 decimal place |

---

## Date Utilities

`src/lib/date.ts` wraps `date-fns`.

| Function | Returns |
|---|---|
| `getTodayKey()` | `'yyyy-MM-dd'` string for today |
| `getDateKey(date)` | `'yyyy-MM-dd'` string for any `Date` |
| `getWeekKeys(offset)` | Array of 7 day keys for the week (Mon–Sun), offset in weeks |
| `getWeekLabel(offset)` | Human label: `'This week'`, `'Last week'`, or date range |
| `formatDayLabel(dayKey)` | `'Monday, Mar 4'` |
| `formatShortDay(dayKey)` | `'Mon'` |
| `formatTime(date)` | `'9:42 AM'` |
| `getLast30DayKeys()` | Array of 30 day keys ending today |
| `getLastNDayKeys(n)` | Array of N day keys ending today |
| `getLast12MonthBuckets()` | Array of `{ label, startKey, endKey }` for past 12 months |

All day keys use the format `'yyyy-MM-dd'`, which sorts correctly as a plain string.

---

## Internationalization

`src/lib/i18n.ts`

Supported languages: `'en' | 'ru' | 'uk' | 'cs' | 'de' | 'fr' | 'es'`

Translation objects contain all UI strings keyed by a short name (e.g. `logMeal`, `chatWelcome`, `saveBtn`). The active language is stored in `UserSettings.language` (localStorage) and provided via `LangContext` / `useLang()` hook.

The file also exports `getGeminiLanguageInstruction(lang)` which appends a language instruction to the Gemini system prompt so the model responds in the user's chosen language.

---

## Routing

`src/App.tsx` uses `HashRouter` (required for Cloudflare Pages static deployment — no server-side routing needed).

| Path | Component |
|---|---|
| `/` | `Dashboard` |
| `/chat` | `Chat` |
| `/history` | `History` |
| `/analytics` | `Analytics` |
| `/measurements` | `Measurements` |
| `/settings` | `Settings` |

The `BottomNav` is hidden on `/chat` and `/settings` via a `HIDE_NAV_ROUTES` list.

---

## PWA / Offline Strategy

Configured in `vite.config.ts` via `vite-plugin-pwa` (Workbox).

| Resource | Strategy |
|---|---|
| App shell (JS, CSS, HTML) | Cache-first (Workbox `StaleWhileRevalidate`) |
| Icons, fonts | Cache-first |
| `generativelanguage.googleapis.com` | `NetworkOnly` — Gemini must be online |

The app manifest configures:
- `display: 'standalone'` — full-screen PWA mode
- `theme_color: '#7cb87a'` (green)
- `background_color: '#18180f'` (dark olive)
- Icons: 192×192, 512×512, maskable 512×512, apple-touch-icon 180×180

---

## Build & Deploy

### Build

```bash
npm run build
# → tsc -b && vite build
# Output: dist/
```

Vite splits chunks for better caching:

| Chunk | Contents |
|---|---|
| `vendor` | react, react-dom, react-router-dom |
| `charts` | recharts |
| `db` | dexie, dexie-react-hooks |
| `gemini` | @google/generative-ai |

### Deploy

```bash
npm run deploy
# → npm run build && wrangler pages deploy dist --project-name diet-tracker
```

Cloudflare Pages project: `diet-tracker`
Live URL: https://diet-tracker-f3b.pages.dev

---

## Testing

Unit tests use **Vitest** with the `jsdom` environment.

```bash
npm test           # run once
npm run test:watch # watch mode
```

Test files live alongside source in `src/**/*.test.ts`.

Current coverage:
- `src/lib/nutrition.test.ts` — all nutrition math functions
- `src/lib/date.test.ts` — day key generation and formatting
