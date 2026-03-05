# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **First-time onboarding flow** (`/onboarding`): 6-step wizard — Welcome (with language picker), Nutrition Primer (protein/fat/carbs explained with macro split visual + link to articles), Body Stats (sex/age/weight/height, metric with conversion hints), Activity & Goal, Results with connected macro sliders, and Done screen. Calculates personalised calorie and macro targets using Mifflin-St Jeor BMR × activity TDEE.
- **Macro distribution insights**: live contextual note on the onboarding slider screen explains how the current protein/fat/carbs split will affect lifestyle — warns about muscle loss for low protein (<1.2g/kg), hormone issues for very low fat (<20%), keto territory for high fat (>40%) or low carbs (<80g), and shows positive feedback for balanced distributions.
- **Connected macro sliders**: protein and fat sliders update carbs automatically within calorie budget; slider bounds enforce healthy minimums (≥20% of calories from fat, ≥20g carbs). Protein defaults to 1.8–2.0g/kg depending on goal.
- **Onboarding weight → Body log**: the `weightKg` entered during onboarding is saved as the first `BodyMeasurement` record, so the Body log is pre-populated immediately after setup.
- `src/lib/goalCalculator.ts` — pure calculation functions for BMR, TDEE, calorie target, macro goals, and slider bounds. 26 Vitest tests added.
- `OnboardingProfile` type in `src/types/index.ts`; `UserSettings` extended with `onboardingComplete` and `onboardingProfile`.
- Existing users auto-migrated to skip onboarding via `migrateSettings()` called in `main.tsx`.
- **PWA maskable icon**: `public/icons/icon-maskable-512x512.png` — icon at 75% scale on 512×512 dark background, keeping content within the W3C safe zone. Manifest uses this dedicated file for `purpose: maskable`.
- **Chat history persistence**: messages saved to `localStorage` (`dtk_chat_history`), restored on re-open. Max 100 messages; `setup` messages excluded. Trash icon in header clears history with confirmation.
- **LLM-powered nutrition Q&A**: free-form questions in chat ("how am I doing today?", "is my protein high enough?") are automatically classified and routed to `askNutritionQuestion`. Context includes today's goals and consumed macros, last 7 days of daily totals, and latest logged body weight.
- `classifyIntent(userInput, lang)` — lightweight Gemini call (64 token output) returning `'log' | 'question'`.
- `askNutritionQuestion(question, lang, context)` — plain-text coaching response via Gemini.
- `NutritionContext` interface with `recentDays` and `latestWeight` fields.
- New `'answer'` chat role — distinct bubble style with `whitespace-pre-wrap`.
- **"Uff, what is an API key?" explainer modal**: a help icon + link next to the API key field in Settings and in the Chat setup card opens a friendly bottom-sheet explaining what an API key is, 3 numbered steps, and a direct link to Google AI Studio. Available in all 7 languages.
- **Edit and delete meal actions**: pencil + trash icons on hover (desktop) and after 300ms long-press (mobile). Available on Dashboard meal cards and History rows.
- **Edit Meal dialog**: inline description/notes editing that saves to IndexedDB without re-parsing.
- Articles section (`/articles`) with 3 evidence-based nutrition guides.
- SEO meta tags, JSON-LD structured data, `robots.txt`, `sitemap.xml`.
- Accessibility improvements on MacroRing, MacroBar, MealCard, BottomNav, FAB.

### Changed
- **"Clear all data" → archive instead of delete**: settings and chat history are renamed to `dtk_archive_<timestamp>_*` keys (recoverable) instead of permanently deleted. IndexedDB is cleared and the user is returned to onboarding.
- Chat page header shows "Nutrition Assistant" and placeholder updated to "Log a meal or ask a question...".
- Migrated from `gemini-2.0-flash` (retired 2026-03-03) to `gemini-2.5-flash`.
- `maxOutputTokens` raised to 4096 to prevent truncated JSON from thinking model.
- Back button added to Settings screen.
- Animation polish across all pages and components.

### Fixed
- FAB on Dashboard no longer overflows outside the centered `max-w-md` column on desktop.
- BottomNav shown on Chat page; content adjusted with `pb-20`.

---

## [1.0.0] — 2026-03-04

Initial public release.

### Added

**Core features**
- AI meal logging via Google Gemini 2.5 Flash — describe what you ate in plain text and get structured macro breakdown
- Manual meal logging fallback — enter macros by hand when offline or without an API key
- Daily dashboard with calorie ring (SVG donut) and per-macro progress bars vs. configurable goals
- Meal history with week selector and daily breakdowns
- Body measurements tracking — log weight, waist, chest, hips, arms, thighs
- Analytics page with Nutrition and Body tabs, Daily (30 day) and Monthly (12 month) period views using Recharts

**Infrastructure**
- PWA with Workbox service worker — app shell cached, works fully offline except Gemini calls
- IndexedDB storage via Dexie.js — meals and measurements tables indexed by day key
- localStorage settings — Gemini API key, macro goals, language preference
- Cloudflare Pages deployment

**Internationalisation**
- 7 languages: English, Russian, Ukrainian, Czech, German, French, Spanish
- Language selector in Settings; Gemini responses also switch to the selected language

**Developer tooling**
- Vitest unit tests — 38 tests for nutrition math and date utilities
- `CLAUDE.md` development context file
- Claude skills for `/commit`, `/deploy`, `/plan`, `/test`
