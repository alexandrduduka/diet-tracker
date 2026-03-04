# Contributing

Thanks for your interest in contributing to Diet Tracker. This is primarily a personal project but contributions are welcome.

## Getting Started

```bash
git clone git@github.com:alexandrduduka/diet-tracker.git
cd diet-tracker
npm install
npm run dev
```

You'll need a [Gemini API key](https://aistudio.google.com) to use the AI meal logging feature. Set it in the app's Settings page.

## Development Workflow

1. Fork the repository and create a feature branch from `main`
2. Make your changes
3. Run `npm test` — all tests must pass
4. Run `npm run build` — build must succeed with no TypeScript errors
5. Run `npm run lint` — no new lint errors
6. Open a pull request with a clear description of what changed and why

## Project Conventions

### Code style

- TypeScript strict mode — no `any` unless unavoidable
- React functional components with hooks only — no class components
- Imports: named exports preferred; default export only for pages and the root `App`
- No barrel `index.ts` re-exports — import directly from the source file

### UI strings

All user-visible text goes in `src/lib/i18n.ts`. The app supports 7 languages:
`en`, `ru`, `uk`, `cs`, `de`, `fr`, `es`.

When adding a new string:
1. Add the key to the `Translations` interface
2. Add the English value
3. Add a reasonable translation for all other languages (machine translation is acceptable for a PR — a native speaker can improve it later, just note it in the PR)

### Data models

All shared TypeScript interfaces live in `src/types/index.ts`. Avoid defining types inline in component files.

### Styling

Use the existing Tailwind color palette — do not introduce new hex values unless there's a strong reason. See `CLAUDE.md` for the full color reference.

### Tests

Unit tests go alongside source files: `src/lib/foo.test.ts` next to `src/lib/foo.ts`. Write tests for pure utility functions. React components and Dexie hooks don't need unit tests.

## What's In Scope

- Bug fixes
- New language translations or improving existing ones
- Performance improvements
- Accessibility improvements
- New chart types or analytics views
- Additional body measurement fields

## What's Out of Scope

- Backend / server-side features — this is intentionally a client-only app
- User accounts or cloud sync
- Monetisation features
- Switching from Gemini to another LLM provider (open an issue to discuss first)

## Reporting Issues

Open an issue on GitHub with:
- Steps to reproduce
- Expected vs. actual behaviour
- Browser and OS
- Whether the issue happens with the installed PWA, browser tab, or both
