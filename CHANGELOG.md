# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Chat history persistence**: chat messages (including coach, answer, result, and user bubbles) are saved to `localStorage` under key `dtk_chat_history` and restored on re-open. Maximum 100 messages retained; `setup` messages are never persisted. A clear-chat button (trash icon) in the header lets users wipe the history.
- **LLM-powered nutrition Q&A**: users can now ask free-form questions in the chat ("how am I doing today?", "why am I losing weight slowly?", "summarise what I ate", "is my protein high enough?"). The app automatically classifies the intent — if it's a question it calls the new `askNutritionQuestion` function; if it's a meal description it calls the existing `parseMealDescription` function.
- `classifyIntent(userInput, lang)` — lightweight Gemini call (64 token output) that returns `'log' | 'question'`. Photos always route to meal-logging; classification is skipped for image-only messages.
- `askNutritionQuestion(question, lang, context)` — plain-text Gemini response using a coaching system prompt. Context includes today's goals and consumed macros, last 7 days of daily totals (only days with data), and latest logged body weight.
- `NutritionContext` interface extending `MealContext` with `recentDays` and `latestWeight` fields.
- New `'answer'` role in `ChatMessage` union: renders as a slightly distinct bubble (dark background, `whitespace-pre-wrap`) so answers are visually distinct from welcome/coaching messages.
- New i18n strings in all 7 languages: `chatTitle`, `chatInputPlaceholder`, `chatClearHistory`, `chatClearHistoryConfirm`, `chatAnswerError`.
- Chat page header now shows "Nutrition Assistant" (`chatTitle`) and input placeholder updated to "Log a meal or ask a question...".

---

### Added (previous)
- First-time user onboarding flow (`/onboarding`): 6-step wizard — Welcome (with language picker), Nutrition Primer (protein/fat/carbs explained with macro split visual + link to articles), Body Stats (sex/age/weight/height), Activity & Goal, Results with connected macro sliders, and Done screen. Calculates personalised calorie and macro targets using Mifflin-St Jeor BMR × activity TDEE. Protein and fat sliders update carbs automatically; slider bounds enforce healthy minimums (≥20% of calories from fat, ≥20g carbs). Existing users auto-migrated to skip onboarding via `migrateSettings()`.
- `src/lib/goalCalculator.ts` — pure calculation functions for BMR, TDEE, calorie target, macro goals, and slider bounds. 26 Vitest tests in `goalCalculator.test.ts`.
- `OnboardingProfile` type in `src/types/index.ts`; `UserSettings` extended with `onboardingComplete` and `onboardingProfile`.
- PWA maskable icon: `public/icons/icon-maskable-512x512.png` — icon at 75% scale on 512×512 dark background, keeping content within the W3C safe zone. Manifest now references this dedicated file for the `maskable` purpose.
- Edit and delete actions on meal items: pencil + trash icons appear on hover (desktop) and after a 300ms long-press (mobile), keeping the UI clean by default. Available on both Dashboard meal cards and History day-summary meal rows.
- Edit Meal dialog: tap the pencil icon to edit the meal description and notes inline. Saves to IndexedDB without re-parsing with LLM.

### Fixed
- FAB (+ button) on Dashboard no longer overflows outside the centered max-w-md column on desktop — wrapped in a `max-w-md mx-auto` constraint div
- BottomNav now shown on the Log (Chat) page; page content adjusted with `pb-20` so the input bar stays above the nav

### Added
- Inline API key setup wizard in Chat: when no key is configured, a step-by-step card replaces the error message. Leads with "free, ~30 seconds", opens Google AI Studio directly, and retries the meal automatically after saving.
- LLM coaching chat: Gemini now returns a 2–3 sentence coaching message alongside the meal analysis. Today's goals and consumed macros are passed as context so the coach knows the remaining budget. After saving a meal the coaching message appears as an assistant bubble; the input stays open to log more.
- Voice-to-text mic button in Chat: tap the mic icon to speak your meal description — speech is transcribed and inserted into the text input using the Web Speech API. The mic button is automatically hidden on browsers that don't support it. The recognition language matches the selected app language.
- Photo attachment in Chat: tap the camera icon to take a photo or choose from the library. The image is shown as a thumbnail preview and passed as inline multimodal data to Gemini alongside the text description, enabling food recognition from photos.
- Articles section (/articles) with 3 evidence-based nutrition guides: "How to Calculate Your Daily Calorie Needs" (BMR/TDEE with Mifflin-St Jeor formula), "Understanding Macros: Protein, Carbs & Fat" (Atwater factors, AMDR ranges, per-macro roles), and "Evidence-Based Dietary Strategies That Work" (Mediterranean diet, calorie balance, high-protein, IF, low-carb review). Accessible via a new "Learn" tab in the bottom navigation. Article detail pages update the browser title for SEO. Content structured as JSX-renderable sections (no markdown library needed).
- SEO improvements: full meta tags in index.html (description, Open Graph, Twitter Card), JSON-LD WebApplication structured data, canonical URL, `robots.txt`, `sitemap.xml`
- Accessibility improvements: `role="meter"` + aria attributes on MacroRing, `role="progressbar"` + aria on MacroBar, `aria-expanded` on MealCard toggle, `aria-label` on Dashboard Settings button and FAB, `aria-label="Main navigation"` on BottomNav, `aria-hidden` on decorative icons
- PWA manifest enhancements: `categories`, app shortcuts (Log Meal, Dashboard), fixed icon `purpose` to separate `any` and `maskable` entries

### Changed
- Migrated from `gemini-2.0-flash` (retired 2026-03-03) to `gemini-2.5-flash`
- Tightened rate-limit error detection to avoid false positives
- Back button added to Settings screen
- Improved fallback error message to surface raw API error text for easier debugging
- Aesthetic polish: full animation system across all pages and components — page fade-in on navigation, MacroRing glow (green when near goal, amber when over), MacroBar staggered entrance with near-goal fill glow, BottomNav active indicator dot + icon scale, MealCard fade-in-up entrance with collapse animation on delete and desktop hover shimmer sweep, Dashboard FAB ping when no meals logged, meal card and macro bar staggered entrances, History sparkline bars animate from zero on mount with per-bar stagger, DaySummary cards stagger in

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
