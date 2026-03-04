# Plan

Research and design an implementation plan for a new feature or change before writing any code.

## Steps

1. **Read CLAUDE.md** to refresh context on project structure, patterns, and conventions
2. **Explore the relevant area** — read the files that will be touched
3. **Identify all affected files:**
   - New pages → `src/pages/`, route in `App.tsx`, nav item in `BottomNav.tsx`
   - New strings → `src/lib/i18n.ts` (all 7 languages)
   - New DB fields → `src/db/index.ts`, `src/types/index.ts`
   - New hooks → `src/hooks/`
   - New components → `src/components/`
4. **Write the plan** covering:
   - Files to create (with purpose)
   - Files to modify (with specific changes)
   - Data model changes (if any)
   - Any edge cases or gotchas
5. **Present the plan** to the user for approval before touching any code

## Key patterns to follow

- All UI strings go in `src/lib/i18n.ts` — add to `Translations` interface AND all 7 language objects
- New pages use `useLang()` for translations
- Data reads use `useLiveQuery` from `dexie-react-hooks` — wrap in a hook in `src/hooks/`
- Day keys are always `'yyyy-MM-dd'` strings from `src/lib/date.ts`
- Design tokens: background `#18180f`, surface `#2e2e22`, green accent `#7cb87a`, amber `#d4a24c`
- Charts follow the Recharts styling pattern in `src/pages/Analytics.tsx`
- Buttons/inputs use shadcn/ui primitives from `src/components/ui/`
- Hash router — no server-side routing, links use `useNavigate()` or `<NavLink>`
