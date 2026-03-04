# Diet Tracker

A personal nutrition tracking PWA — log meals with AI, track macros, and monitor body measurements. No backend, no accounts, everything stays on your device.

**Live app:** https://diet-tracker-f3b.pages.dev

## Features

- **AI meal logging** — describe what you ate in plain text; Gemini parses foods, quantities, and macros automatically
- **Manual fallback** — log macros by hand when offline or without an API key
- **Daily dashboard** — calorie ring and per-macro progress bars vs. your goals
- **History** — week-by-week breakdown of daily intake
- **Analytics** — calorie and macro trends (30-day / 12-month charts), body measurement charts
- **Body measurements** — log and chart weight, waist, chest, arms, thighs over time
- **Fully offline** — app shell and all data cached locally; only Gemini calls require internet
- **PWA** — installable on iOS and Android, works as a standalone app
- **Multi-language** — English, Russian, Ukrainian, Czech, German, French, Spanish

## Quick Start

### 1. Get a Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in with a Google account
2. Click **Get API key** → **Create API key**
3. Copy the key (free tier: 1,500 requests/day, 15 RPM)

### 2. Open the app and configure

1. Open https://diet-tracker-f3b.pages.dev in Chrome or Safari
2. Tap the gear icon (Settings)
3. Paste your Gemini API key and save
4. Adjust calorie and macro goals if needed

### 3. Log your first meal

1. Tap the **+** button or the Chat tab
2. Type what you ate: *"2 scrambled eggs, a slice of toast with butter, and a coffee with milk"*
3. Review the parsed breakdown, then tap **Save**

## Local Development

```bash
git clone git@github.com:alexandrduduka/diet-tracker.git
cd diet-tracker
npm install
npm run dev
```

The app runs at `http://localhost:5173`. A Gemini API key is required for the AI logging feature.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run deploy` | Build and deploy to Cloudflare Pages |

## Deploy

The app deploys to Cloudflare Pages. Any push to `main` triggers a new build.

Manual deploy:

```bash
npm run deploy
```

Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and a Cloudflare account with the `diet-tracker` Pages project created.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript + Tailwind CSS v4 |
| Components | Radix UI primitives (shadcn/ui) |
| Charts | Recharts |
| Local DB | Dexie.js (IndexedDB) |
| AI | Google Gemini 2.0 Flash |
| Date utilities | date-fns |
| PWA / Service Worker | vite-plugin-pwa (Workbox) |
| Build | Vite 7 |
| Deploy | Cloudflare Pages |

## Project Structure

```
src/
├── db/index.ts          — Dexie schema (meals, measurements tables)
├── types/index.ts       — Shared TypeScript interfaces
├── lib/
│   ├── gemini.ts        — Gemini API client + structured prompt
│   ├── nutrition.ts     — Macro math helpers
│   ├── date.ts          — Date key utilities
│   └── i18n.ts          — Translation strings + language helpers
├── store/settings.ts    — localStorage wrapper (API key, goals, language)
├── hooks/               — Dexie useLiveQuery hooks
├── components/          — Reusable UI components
└── pages/               — Route-level page components
```

See [docs/TECHNICAL.md](docs/TECHNICAL.md) for architecture details and [docs/PRODUCT.md](docs/PRODUCT.md) for a full feature guide.

## Privacy

All meal and measurement data is stored locally in your browser's IndexedDB. Nothing is sent to any server except Gemini API calls (your meal descriptions go to Google's API when using AI logging). No analytics, no tracking, no accounts.
