# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Inline API key setup wizard in Chat: when no key is configured, a step-by-step card replaces the error message. Leads with "free, ~30 seconds", opens Google AI Studio directly, and retries the meal automatically after saving.
- LLM coaching chat: Gemini now returns a 2–3 sentence coaching message alongside the meal analysis. Today's goals and consumed macros are passed as context so the coach knows the remaining budget. After saving a meal the coaching message appears as an assistant bubble; the input stays open to log more.
- Voice-to-text mic button in Chat: tap the mic icon to speak your meal description — speech is transcribed and inserted into the text input using the Web Speech API. The mic button is automatically hidden on browsers that don't support it. The recognition language matches the selected app language.
- Photo attachment in Chat: tap the camera icon to take a photo or choose from the library. The image is shown as a thumbnail preview and passed as inline multimodal data to Gemini alongside the text description, enabling food recognition from photos.

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
