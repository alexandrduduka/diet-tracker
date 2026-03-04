# Develop and Ship

Implement a feature or fix end-to-end: plan → code → test → document → commit → push → deploy.

## Steps

### 1. Plan (if not already done)
- Read `CLAUDE.md` to refresh context
- Explore the relevant files that will be touched
- If the change is non-trivial, run `/plan` and get user approval before coding

### 2. Implement
- Make all code changes
- Follow conventions in `CLAUDE.md` (i18n strings in all 7 languages, design tokens, shadcn/ui primitives, etc.)

### 3. Test
- Run `npm test` — all existing tests must stay green
- If new pure logic was added to `src/lib/`, add tests for it

### 4. Build
- Run `npm run build` — must produce zero TypeScript errors and a clean Vite output
- Fix any errors before proceeding

### 5. Update docs
- **`CLAUDE.md`** — update if any architecture or behaviour changed
- **`CHANGELOG.md`** — add entry under `## [Unreleased]`
- **`docs/TECHNICAL.md`** — update if data models, APIs, or architecture changed
- **`docs/PRODUCT.md`** — update if user-facing features or UX changed

### 6. Commit
- Stage specific files (never `git add .` or `git add -A`)
- Commit message: imperative mood, summarises the *why*, include `Co-Authored-By: Claude <noreply@anthropic.com>`

### 7. Push
- `git push origin main`

### 8. Deploy
- `npm run deploy`
- Report the deployment URL

## Definition of Done

All 8 steps above complete with no errors. Do not consider the task done until the deploy URL is confirmed.
