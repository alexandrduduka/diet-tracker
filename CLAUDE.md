# Diet Tracker — Claude Development Context

This file gives Claude full context to continue development without re-exploring the codebase from scratch.

## Project Summary

Personal nutrition PWA. No backend. All data in IndexedDB (Dexie.js). AI meal parsing via Google Gemini. Deployed to Cloudflare Pages.

**Live URL:** https://diet-tracker-f3b.pages.dev
**Repo:** git@github-personal:alexandrduduka/diet-tracker.git (personal GitHub: `alexandrduduka`)
**Deploy project name:** `diet-tracker` (Cloudflare Pages)

## Commands

```bash
npm run dev          # Vite dev server at localhost:5173
npm run build        # tsc -b && vite build → dist/
npm run preview      # Preview dist/ at :4173
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch)
npm run deploy       # build + wrangler pages deploy dist --project-name diet-tracker
```

## Git Setup

Two GitHub accounts on this machine:
- `alexduduka-jt` — work account (default HTTPS token in Keychain — avoid for this repo)
- `alexandrduduka` — personal account (uses SSH key `~/.ssh/id_ed25519_personal`)

**Always push using SSH alias:**
```bash
git remote get-url origin  # should be git@github-personal:alexandrduduka/diet-tracker.git
git push origin main
```

If origin is wrong: `git remote set-url origin git@github-personal:alexandrduduka/diet-tracker.git`

## Project Structure

```
diet-tracker/
├── index.html
├── vite.config.ts          ← PWA config, Workbox, chunk splitting
├── vitest.config.ts        ← Vitest with jsdom environment
├── public/icons/           ← icon.svg (source), *.png (generated with sharp)
├── docs/
│   ├── TECHNICAL.md        ← Architecture, data models, API details
│   └── PRODUCT.md          ← Feature guide, user-facing docs
└── src/
    ├── App.tsx              ← HashRouter, routes, AppShell with BottomNav logic (HIDE_NAV_ROUTES = ['/onboarding'])
    ├── main.tsx
    ├── index.css
    ├── db/index.ts          ← Dexie DB (meals, measurements tables)
    ├── types/index.ts       ← All shared interfaces
    ├── store/
    │   ├── settings.ts      ← localStorage wrapper (STORAGE_KEY='dtk_settings')
    │   └── langContext.tsx  ← React context + useLang() hook
    ├── lib/
    │   ├── gemini.ts        ← Gemini 2.5 Flash client, structured JSON prompt
    │   ├── nutrition.ts     ← sumMacros, validateAndFixCalories, roundMacros, fmt, etc.
    │   ├── date.ts          ← getTodayKey, getWeekKeys, getLast12MonthBuckets, etc.
    │   ├── i18n.ts          ← All UI strings in 7 languages + getGeminiLanguageInstruction()
    │   ├── utils.ts         ← cn() (clsx + tailwind-merge)
    │   ├── nutrition.test.ts ← 23 Vitest tests (includes fmt)
    │   └── date.test.ts     ← 18 Vitest tests (pinned to 2026-03-04 via vi.useFakeTimers)
    ├── hooks/
    │   ├── useTodayMeals.ts        ← useLiveQuery for today's meals
    │   ├── useGoals.ts             ← reads goals from settings
    │   ├── useMeasurements.ts      ← useLiveQuery for measurements
    │   └── useNutritionHistory.ts  ← daily/monthly nutrition aggregation
    ├── components/
    │   ├── BottomNav.tsx    ← 5-tab nav (Today / Log & Ask / Charts / Learn / Settings)
    │   ├── MacroRing.tsx    ← SVG donut for calories
    │   ├── MacroBar.tsx     ← progress bar per macro vs goal
    │   ├── MealCard.tsx     ← single meal display + delete
    │   ├── MeasurementChart.tsx ← Recharts line chart wrapper
    │   ├── OfflineBanner.tsx + useOnlineStatus hook
    │   └── ui/             ← shadcn/ui primitives (button, card, dialog, input)
    └── pages/
        ├── Dashboard.tsx   ← MacroRing + MacroBar + meal list + FAB + body nudge banner
        ├── Chat.tsx        ← LLM meal logging + Q&A + suggestion chips + manual fallback
        ├── History.tsx     ← exports HistoryContent (used in Analytics); History page wraps it
        ├── Analytics.tsx   ← Nutrition/Body/History tabs, Daily/Monthly toggle, Recharts
        ├── Measurements.tsx ← Log drawer + Recharts chart + entries list
        ├── Settings.tsx    ← API key + goals form + language + export + clear
        └── Onboarding.tsx  ← 6-step first-time wizard (welcome, nutrition, stats, activity/goal, results+sliders, done)
```

## Routing

`HashRouter` (required for Cloudflare Pages static deployment).

| Path | Page | Nav visible |
|---|---|---|
| `/` | Dashboard | yes |
| `/chat` | Chat (Log & Ask) | yes |
| `/history` | History | yes |
| `/measurements` | Measurements | yes |
| `/analytics` | Analytics | yes |
| `/settings` | Settings | yes |
| `/onboarding` | Onboarding | no |

`HIDE_NAV_ROUTES = ['/onboarding']` in `App.tsx`. Settings is now a main nav tab.

First-time users are redirected to `/onboarding` by a guard in `AppShell` that checks `getSettings().onboardingComplete`. Existing users are silently migrated by `migrateSettings()` called in `main.tsx` before the React render.

## Data Layer

### IndexedDB (Dexie)

```typescript
// src/db/index.ts
db.version(1).stores({
  meals: '++id, dayKey, timestamp',
  measurements: '++id, dayKey, timestamp',
});
```

`dayKey` format: `'yyyy-MM-dd'` — primary query index for all reads.

### localStorage (settings)

Key: `'dtk_settings'`. Defaults: 2000 kcal / 150g protein / 65g fat / 250g carbs / language: 'en' / `onboardingComplete: false`.

`getSettings()` always merges stored values over defaults (safe to add new fields to `DEFAULT_SETTINGS`).

`migrateSettings()` (called in `main.tsx`) detects existing users by checking if `dtk_settings` exists but lacks `onboardingComplete`, and sets it to `true` to skip onboarding.

## Gemini Integration

- Model: `gemini-2.5-flash`, `responseMimeType: 'application/json'`
- `temperature: 0.1` (no context) / `0.4` (with coaching context), `maxOutputTokens: 4096`
- Returns structured JSON: `{ foods[], confidence, notes?, message? }`
- `message` is a 2–3 sentence coaching comment in the app language; only present when `MealContext` is passed
- `MealContext` carries today's `goals` + `consumed` macros — injected into system prompt as remaining budget
- **Multimodal image support**: `parseMealDescription` accepts an optional `ImageAttachment { base64, mimeType }`. When provided, the image is passed as an `inlineData` part alongside the text — Gemini identifies the food visually.
- Post-processing: `validateAndFixCalories` recalculates if LLM calories are >10% off from macros
- Error detection checks both `err.status` AND `err.message` text (SDK embeds status in message string)
- Error types thrown: `'NO_API_KEY'` | `'RATE_LIMIT'` | `'INVALID_API_KEY'` | `'PARSE_ERROR'` | `'API_ERROR: ...'`
- `maxOutputTokens` must stay ≥ 4096 — gemini-2.5-flash uses thinking tokens internally; lower values cause truncated JSON → PARSE_ERROR (confirmed: 2048 caused truncation even on simple queries like "banana")
- On PARSE_ERROR, `parseMealDescription` automatically retries once with a corrective prompt appended asking the model to complete the truncated JSON
- `classifyIntent(userInput, lang)` — lightweight JSON call (`maxOutputTokens: 64`) that returns `'log' | 'question'`. Used by Chat page before routing to meal-parsing or Q&A.
- `askNutritionQuestion(question, lang, context)` — plain-text response (no `responseMimeType`) with a coaching system prompt. Uses `NutritionContext` which extends `MealContext` with `recentDays` (last 7 days totals) and `latestWeight`.
- `NutritionContext` extends `MealContext` with `recentDays?: Array<{dayKey, calories, protein, fat, carbs}>` and `latestWeight?: number`.

## Chat Page — Key Behaviours

- **No API key**: shows inline setup wizard card instead of error. Card opens `aistudio.google.com/app/apikey`, accepts key inline, and retries the original message automatically. The "Uff, what is an API key?" link opens a modal with a JSX visual mockup of AI Studio, a quota note (1,500 req/day free), and a link to view usage.
- **After save**: if `parsed.message` is present, appends a `'coach'` bubble and keeps the input open (no navigation). If no message, navigates to `/`.
- **ChatMessage roles**: `'assistant' | 'user' | 'result' | 'error' | 'setup' | 'coach' | 'answer'`
- `'assistant'` and `'coach'` render identically (green avatar bubble, `bg-[#2e2e22]`).
- `'answer'` renders with a distinct background (`bg-[#242419]` + border) and `whitespace-pre-wrap` for multi-line coaching answers.
- **Intent classification**: on each text-only send, `classifyIntent()` (64 token JSON call) determines `'log'` vs `'question'`. Photos always route to `'log'`. Failure falls back to `'log'`.
- **Q&A mode**: when intent is `'question'`, `askNutritionQuestion()` is called with full `NutritionContext` (today goals/consumed + last 7 days totals + latest weight). Response renders as `'answer'` bubble.
- **Chat history persistence**: messages persist to `localStorage` key `dtk_chat_history` in format `{ messages: ChatMessage[], dayKey: string }` on every change. Restored on load. Max 100 messages; `'setup'` messages are never persisted. Trash icon in header opens a clear-history confirmation dialog.
- **Day-change message hiding**: on mount, `loadPersistedChat()` compares stored `dayKey` to `getTodayKey()`. If different, the old messages are stashed in `oldMessages` state and hidden behind a collapsible "Show history" / "New day" separator UI. The active session starts fresh with only the welcome message. `PersistedChat` interface: `{ messages: ChatMessage[], dayKey: string }`. Legacy plain-array format auto-upgraded silently.
- **Message render helper**: `renderChatMessage(msg, i, keyOffset, isInteractive)` extracts the render logic so old messages can be rendered in the collapsed section. `isInteractive: false` skips setup/result bubbles (since they no longer apply to past-day messages).
- **Mic button**: uses Web Speech API (`window.SpeechRecognition || window.webkitSpeechRecognition`). Hidden when not supported. Recognition language matches the app language. Transcript is appended to the text input. Tap again or it ends automatically to stop listening.
- **Camera / photo button**: `<input type="file" accept="image/*" capture="environment">` — opens camera on mobile, file picker on desktop. Image is read as DataURL, split into base64 + mimeType, stored in `attachedImage` state, and sent to Gemini as `ImageAttachment`. Thumbnail preview shown above input bar with a remove button. Can be sent with or without accompanying text.
- **Suggestion chips**: always visible in the input bar (5 chips sourced from `t.chatSuggestion*` keys). Tapping sets `input` state without auto-sending. Chips persist throughout the conversation.
- **Body nudge**: Dashboard shows dismissable amber banner (sessionStorage key `dtk_body_nudge_dismissed`) when `useAllMeasurements()[0]` is older than 14 days or measurements array is empty.
- **Tutorial hints** (`TutorialHint` component): dismiss-once animated hint cards shown on Dashboard (`dtk_hint_dashboard`), Chat (`dtk_hint_chat`), and Articles (`dtk_hint_articles`). Appear 600 ms after mount with fade+scale animation. Dismissed permanently to localStorage.
- **PWA install banner** (`PwaInstallBanner` component): amber banner shown on Dashboard. Fires 4 s after mount if `beforeinstallprompt` is available (Chrome/Android) or iOS Safari detected (no native prompt). Dismissed to `dtk_pwa_install_dismissed` localStorage key.

## Internationalization

7 languages: `'en' | 'ru' | 'uk' | 'cs' | 'de' | 'fr' | 'es'`

- All strings in `src/lib/i18n.ts` — `Translations` interface + per-language objects
- Language stored in `UserSettings.language` (localStorage)
- Provided via `LangContext` / `useLang()` — returns `{ t, lang, setLang }`
- `getGeminiLanguageInstruction(lang)` appends language directive to Gemini system prompt

**To add a new string:** add to `Translations` interface in `i18n.ts`, then add to all 7 language objects.

## Design System

Dark olive palette:
- Background: `#18180f`
- Surface: `#2e2e22`, `#242419`
- Border: `#3a3a2a`
- Text primary: `#f0ede4`
- Text muted: `#9a9680`, `#5a5a44`
- Green accent: `#7cb87a` (active nav, buttons, rings)
- Amber accent: `#d4a24c` (calories, warnings)
- Error/warning bg: `#3a2a1a` border `#5a3a20`

Chart colors: calories=`#d4a24c`, protein=`#7cb87a`, carbs=`#d4a24c`, fat=`#c17a5a`

Chart styling pattern:
```tsx
<CartesianGrid stroke="#3a3a2a" strokeDasharray="3 3" />
<XAxis tick={{ fill: '#9a9680', fontSize: 11 }} axisLine={false} tickLine={false} />
<Tooltip contentStyle={{ backgroundColor: '#242419', border: '1px solid #3a3a2a', borderRadius: '12px' }} />
```

## PWA / Offline

- `vite-plugin-pwa` with Workbox
- App shell: cache-first
- `generativelanguage.googleapis.com`: `NetworkOnly` (Gemini must be online)
- Icons: `icon.svg` (source SVG: measuring cup with green liquid + white label sticker + amber wheat ear), regenerate PNGs with `sharp` if changed
- Manifest: standalone, theme `#7cb87a`, background `#18180f`

## Regenerating PNG Icons

If `public/icons/icon.svg` is changed:
```bash
node -e "
const sharp = require('sharp');
const fs = require('fs');
const svg = fs.readFileSync('public/icons/icon.svg');
Promise.all([
  sharp(svg).resize(192,192).png().toFile('public/icons/icon-192x192.png'),
  sharp(svg).resize(512,512).png().toFile('public/icons/icon-512x512.png'),
  sharp(svg).resize(180,180).png().toFile('public/icons/apple-touch-icon.png'),
]).then(() => console.log('Icons generated'));
"
```

## Build Output

Vite splits into 4 chunks for cache efficiency:
- `vendor` — react, react-dom, react-router-dom
- `charts` — recharts
- `db` — dexie, dexie-react-hooks
- `gemini` — @google/generative-ai

## Testing

```bash
npm test
```

67 tests across 3 files:
- `src/lib/nutrition.test.ts` — 23 tests (includes `fmt` display helper)
- `src/lib/date.test.ts` — 18 tests (pinned to 2026-03-04 via `vi.useFakeTimers`)
- `src/lib/goalCalculator.test.ts` — 26 tests for BMR/TDEE/macro calculation

New test files go alongside source in `src/**/*.test.ts`.

## Analytics

### Google Analytics 4
- Measurement ID: `G-CX3LDP2Y41`
- Injected via `<script async src="…gtag/js?id=G-CX3LDP2Y41">` in `index.html`
- `send_page_view: false` in config — manual page views fired via `trackPageView()` in `AppShell` `useEffect` on every `location.pathname` change (HashRouter-compatible)
- All event helpers in `src/lib/analytics.ts` — typed, no-op if gtag blocked
- Events tracked: `page_view`, `meal_saved`, `meal_discarded`, `meal_edited`, `meal_log_started` (method: text/photo/voice), `nutrition_question_asked`, `chat_history_cleared`, `api_key_saved`, `goals_updated`, `language_changed`, `data_exported`, `onboarding_completed`, `measurement_logged`, `article_opened`
- `anonymize_ip: true` set in config; no PII ever passed to events

### Microsoft Clarity
- Project ID: `vr5878quce`
- Injected via standard Clarity snippet in `index.html` (free heatmaps + session recordings)

## Persistent Logo
- A fixed `<header>` rendered in `AppShell` (above `<main>`) shows the icon PNG + "Eat Me" wordmark
- `z-50`, `pointer-events-none`, opacity-muted so it never interferes with content
- Visible on all routes including `/settings` and `/onboarding`
- Height: 32px (`h-8`); pages with `pt-12` have enough top padding that content never clips behind it

## Known Decisions / History

- HashRouter over BrowserRouter: Cloudflare Pages serves a single static file, no server routing
- No auth: single-user, personal device app — intentional
- Gemini free tier (gemini-2.5-flash): ~250–500 req/day, 10 RPM — sufficient for personal use
- gemini-2.0-flash was retired 2026-03-03; use gemini-2.5-flash going forward
- `llmConfidence: 'manual'` is a valid value (used when user logs macros by hand, not in the union type — works fine at runtime)
- Rate limit error detection: must check `err.message` text, not just `err.status` — Gemini SDK embeds HTTP status in message
- `sharp` is already available in node_modules (pulled in transitively) — no need to install separately for icon generation
- `maxOutputTokens: 1024` caused PARSE_ERROR for gemini-2.5-flash when coaching context was included — raised to 2048, then raised again to 4096 after truncation observed even on simple queries ("banana")
- Onboarding redirect guard calls `getSettings()` directly in `AppShell` (not via React state) — only for the initial redirect decision; existing users have `onboardingComplete: true` after migration
- PWA maskable icon uses a separate `icon-maskable-512x512.png` (icon at 75% scale, centered on dark background) rather than reusing the regular icon — ensures content stays within the W3C safe zone circle for all Android launcher shapes
- "Clear all data" archives rather than deletes: `dtk_settings` and `dtk_chat_history` localStorage keys are renamed to `dtk_archive_<timestamp>_settings` / `dtk_archive_<timestamp>_chat_history`, IndexedDB is cleared, and the user is redirected to `/onboarding`
- API key explainer modal (`apiKeyWhatIsThis`) appears as a bottom-sheet; the same modal is rendered in both `Settings.tsx` (inline component `ApiKeyExplainerModal`) and `Chat.tsx` (inline JSX). The modal re-uses `apiKeyOpenStudio` and `apiKeyExplainStep1/2/3` i18n keys.
- API key modal uses a separate component in Settings.tsx (`function ApiKeyExplainerModal`) but is inlined as JSX in Chat.tsx to avoid a shared module dependency

## Onboarding & Goal Calculator

### Onboarding Flow (`src/pages/Onboarding.tsx`)
6-step wizard shown to first-time users:
0. Welcome — app pitch + language picker
1. Nutrition Primer — protein/fat/carbs explained with macro split visual, link to articles
2. Body Stats — sex, age, weight (kg), height (cm) with metric hints
3. Activity & Goal — 5 activity cards + 3 goal cards
4. Results + Sliders — calorie target, protein slider, fat slider, carbs derived automatically
5. Done — recap + save

After completing step 5, `saveSettings({ goals, onboardingComplete: true, onboardingProfile })` is called, the entered `weightKg` is saved as the first `BodyMeasurement` record via `db.measurements.add(...)`, and the user is redirected to `/`.

**Step 4 macro insights**: a live contextual note below the sliders classifies the current distribution:
- protein < 1.2g/kg → warn (muscle loss risk) — `type: 'warn'` — orange-tinted
- fat < 20% of calories → warn (hormones/vitamins) — `type: 'warn'`
- carbs < 80g → info (low-carb territory) — `type: 'info'` — neutral
- fat > 40% of calories → info (ketogenic-style) — `type: 'info'`
- protein ≥ 2.0g/kg → good (high protein) — `type: 'good'` — green-tinted
- otherwise → good (balanced) — `type: 'good'`

### Goal Calculator (`src/lib/goalCalculator.ts`)
Pure functions (no side effects):
- `calculateBMR(p)` — Mifflin-St Jeor formula
- `calculateTDEE(p)` — BMR × activity multiplier
- `calculateCalorieTarget(p)` — TDEE ± goal offset, min 1200 kcal
- `calculateMacroGoals(p)` — protein 1.8–2.0g/kg, fat 28%, carbs remainder
- `derivedCarbs(calories, protein, fat)` — reactive carbs for slider UI
- `fatSliderBounds(calories, protein)` — min 20% of cals, max 45% limited by MIN_CARBS_G
- `proteinSliderBounds(weightKg)` — 0.8–2.5g/kg
- `MIN_CARBS_G = 20` — absolute minimum carbs exported as constant

## Definition of Done (follow for every feature/fix)

Every change — however small — must clear all of these before it is considered complete:

1. **Tests pass**: `npm test` — all existing tests green. Add new tests for any new pure logic in `src/lib/`.
2. **Build passes**: `npm run build` — zero TypeScript errors, clean Vite output.
3. **Docs updated**: update this file (`CLAUDE.md`) for any architectural or behavioural change. Update `CHANGELOG.md` (Unreleased section). Update `docs/TECHNICAL.md` / `docs/PRODUCT.md` if the change affects documented architecture or user-facing features.
4. **Committed**: `git add <specific files>` + `git commit` with a clear message. Never use `git add -A` or `git add .`.
5. **Pushed**: `git push origin main`.
6. **Deployed**: `npm run deploy` (or `npx wrangler pages deploy dist --project-name diet-tracker`).
