# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [1.0.0] — 2026-03-04

Initial public release.

### Added

**Core features**
- AI meal logging via Google Gemini 2.0 Flash — describe what you ate in plain text and get structured macro breakdown
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
