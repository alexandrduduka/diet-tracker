# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **App renamed to "Eat Right"**: updated in HTML title, Open Graph / Twitter meta tags, PWA manifest, `apple-mobile-web-app-title`, JSON-LD structured data, App.tsx header, ArticleDetail document.title, and all 7 onboarding welcome strings.
- **Chat day-change hiding**: when the app is opened on a new day, previous-day chat messages are automatically hidden behind a collapsible "Show history" button. A "New day" separator is rendered above the fresh session. Persisted chat format upgraded from `ChatMessage[]` to `{ messages, dayKey }` (backward-compatible — old plain-array format is migrated silently).
- **Tutorial hint cards** (`src/components/TutorialHint.tsx`): animated, dismiss-once hint cards shown on first visit to Dashboard, Chat, and Articles. Appear after a 600 ms delay with a fade+scale entrance animation. Dismissed permanently via localStorage (`dtk_hint_dashboard`, `dtk_hint_chat`, `dtk_hint_articles`). 7-language i18n strings added.
- **PWA install prompt banner** (`src/components/PwaInstallBanner.tsx`): dismissable amber banner shown on Dashboard when the `beforeinstallprompt` event fires (Chrome/Edge/Android) or when iOS Safari is detected. On Android/Chrome triggers the native install dialog. On iOS shows the share button instruction. Dismissed permanently via localStorage (`dtk_pwa_install_dismissed`).
- **"What this means for you" section in article detail**: at the bottom of every article, a green-tinted 3-stat card shows personalised numbers computed from the user's `onboardingProfile` (BMR, TDEE, calorie target, macro goals). If no profile is set, shows a prompt to complete onboarding. Computed by `buildPersonalizedInsights()` — article-slug-aware (different stats for calories vs protein vs satiety articles). Falls back gracefully if profile is missing or calculation errors.
- **Article: "Where the Heck Do I Get All That Protein?"** (`slug: where-to-get-protein`): 4-min read, 🥩. Covers why protein is hard to hit, a table of top sources (chicken, Greek yogurt, eggs, cottage cheese, tuna, salmon, tempeh, lentils, whey), practical strategies, and plant-based tips. Available in en/ru/uk (English fallback for cs/de/fr/es).
- **Article: "How Much to Eat to Feel Good (Without Overeating)"** (`slug: how-much-to-eat`): 5-min read, 🍽️. Covers the 20-min satiety lag, what makes food filling (protein, fibre, volume, water content), practical stop-at-the-right-moment habits, calorie-density visual bar chart, and the plate method. Available in en/ru/uk (English fallback for cs/de/fr/es).
- **21 new i18n strings** across all 7 languages: `tutorialChat*`, `tutorialDashboard*`, `tutorialArticles*`, `tutorialDismiss`, `chatNewDay`, `chatOldMessagesHidden`, `chatShowOldMessages`, `pwaInstall*`, `articleForYouTitle`, `articleNoProfile`.

### Added
- **App renamed to "Eat Me"**: updated in HTML title, Open Graph / Twitter meta tags, PWA manifest name, apple-mobile-web-app-title, JSON-LD structured data, and all 7 onboarding welcome strings.
- **Logo strip more prominent**: icon enlarged from 16 px to 24 px, name text size raised from 10 px to 12 px, opacity lifted — more readable on both mobile and desktop.
- **Past-day navigation on Dashboard**: left/right arrow buttons in the Dashboard header let you browse any previous day's meals and macros. Swipe left/right on mobile to change days. Past days show the full calorie ring and macro bars for that day vs. goals. Edit and delete work on past meals; the FAB (add meal) is hidden for past days. A "Today" pill appears when viewing a past day for quick return.
- **Body profile in Settings**: the onboarding profile (weight, height, age, sex, activity level, goal) is now editable inline in the Settings page. When the saved weight changes by ≥ 2 kg, a banner appears offering to recalculate macros using the same Mifflin-St Jeor / TDEE formula as onboarding.
- **Nav rework — 5-tab bottom nav**: Today / Log & Ask / Charts / Learn / Settings. Removed dedicated Body and History tabs; Settings is now a first-class nav item.
- **History tab inside Charts (Analytics)**: History week view is now accessible as a third tab inside the Analytics screen alongside Nutrition and Body. The `/history` route still works as a standalone page.
- **Body measurement nudge on Dashboard**: amber dismissable banner appears when the last logged body measurement is more than 14 days ago (or never). Links to `/measurements`. Dismissed state persists for the session (sessionStorage).
- **Suggestion chips in Chat**: when the chat is fresh (first open or after clearing history), a horizontal scrollable row of 5 tappable chips appears above the input bar — *"2 eggs and toast 🍳"*, *"How am I doing today? 📊"*, *"Is my protein high enough?"*, *"Summarise this week"*, *"When will I finally lose weight? ⚖️"*. Tapping a chip prefills the text input without auto-sending.
- **API key explainer modal redesign**: replaced numbered text steps with a JSX mockup of the Google AI Studio UI (browser chrome + API keys page + copy action) plus a quota info card showing the free-tier limit (1,500 req/day) with a link to view usage in AI Studio.
- **Onboarding Done screen polish** (step 6): full-width layout with side-by-side hero icon+title, daily target card with macro split pill bar, 3-column macro grid cards, and an encouragement note.
- **Onboarding default activity**: default activity multiplier changed from Moderate (1.55) to Lightly active (1.375) — closer to the average sedentary/office worker.
- **`navSettings` i18n key** added to all 7 languages; `navLog` updated across all languages to convey "Log & Ask"; `chatWelcome` updated to highlight both meal logging and Q&A in one sentence; 4 `chatSuggestion*` chip strings added; `bodyNudgeText`/`bodyNudgeAction`/`apiKeyQuotaNote`/`apiKeyViewUsage` added.

### Changed
- **Body profile absent state in Settings**: replaced the static "complete onboarding" hint with a tappable "Set up your profile →" link that navigates to the onboarding screen.
- **Chat suggestion chips**: chips are now always visible in the input bar (previously only shown on a fresh/empty chat). They persist throughout the conversation so common prompts are always one tap away.
- **Nutrient display rounding**: protein, carbs and fat are now always rounded to 1 decimal place wherever they appear (meal cards, chat result cards, history day totals). Calories remain whole numbers. Added `fmt()` helper in `nutrition.ts`.
- Settings page now shows the bottom nav bar (was hidden before — now it's a main nav tab).
- `HIDE_NAV_ROUTES` reduced to `['/onboarding']` only.
- **App icon redesigned**: replaced abstract teardrop with a measuring cup partially filled with green liquid, with a small leaf motif on the cup body and graduation marks. Communicates measuring/tracking food, works for all diets. All PNG variants regenerated (192px, 512px, 180px apple-touch, 512px maskable).
- **Chat tab icon**: changed from Bot to `PenLine` (pen with line) — better conveys both logging and asking.

- **Google Analytics 4** (G-CX3LDP2Y41): page-view tracking on every HashRouter navigation plus custom events — `meal_saved`, `meal_discarded`, `meal_edited`, `meal_log_started` (method: text/photo/voice), `nutrition_question_asked`, `chat_history_cleared`, `api_key_saved`, `goals_updated`, `language_changed`, `data_exported`, `onboarding_completed`, `measurement_logged`, `article_opened`. IP anonymization enabled; no PII sent.
- **Microsoft Clarity** (project `vr5878quce`): free heatmap and session-recording tool injected via standard snippet in `index.html`.
- **`src/lib/analytics.ts`**: typed analytics helper — all `gtag()` calls centralised here; no-ops gracefully if gtag is blocked.
- **Persistent logo strip**: a fixed `<header>` at the top of the app shell shows the Diet Tracker icon and wordmark on every screen (opacity-muted, non-interactive, `z-50`).
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
- **Articles fully internationalised**: all 4 articles are now available in all 7 app languages (en, ru, uk, cs, de, fr, es). Titles, excerpts, tags, and full content are translated. Language switches instantly without page reload.
- **New article** "Sport & Active Lifestyle: What Exercise Actually Does" — covers why exercise doesn't replace diet but matters for hormonal balance, muscle mass (permanent BMR boost), sleep, and mental health; 7–10k daily steps; bodyweight training for beginners.
- Two new article section types: `stat-row` (3-column key-figure grid with amber values) and `visual-bar` (horizontal bar comparison chart with colour-coded bars). Reworked all 3 existing articles to be shorter and more direct.
- Articles section (`/articles`) with evidence-based nutrition guides.
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
- **Accidental deletion on mobile**: edit/delete action buttons were `opacity-0` but still had active pointer events, causing invisible taps on mobile (no hover state) to fire delete immediately. Fixed by adding `pointer-events-none` when hidden and `pointer-events-auto` only after long-press reveals the actions. Applies to both `MealCard` and `HistoryMealRow`.

### Changed (this session)
- **App icon updated**: the label on the measuring cup now shows a dark amber wheat ear (колосок) on a white paper sticker (`#f5f0e8`), replacing the green leaf motif that was invisible against the green liquid fill. All PNG variants regenerated.
- **API key modal copy rewrite**: all 7 languages updated with warmer, friendlier language — *"One quick setup step — then it just works"*, *"100% free. No credit card, no account in this app, no catch."*, and an explainer body line *"Seriously, your mom could do it."* CTA changed from "Got it" to *"OK, I'll try it!"*.
- `fmt()` helper added to `src/lib/nutrition.ts` — centralises display rounding: calories → integer, all other macros → 1 decimal place. Used across `MealCard`, `History`, and `Chat` result cards.

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
