# Test

Run the test suite and fix any failures.

## Steps

1. Run `npm test`
2. If all tests pass — report the count and done
3. If tests fail — read the failing test files and the source files they test, fix the failures, run again

## Writing new tests

New test files go alongside source: `src/lib/foo.test.ts` next to `src/lib/foo.ts`.

**Patterns used in this project:**

```typescript
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// Pin time for date-dependent tests
beforeAll(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-03-04T12:00:00')); });
afterAll(() => { vi.useRealTimers(); });
```

**What to test:**
- Pure utility functions in `src/lib/` — nutrition math, date helpers
- Settings helpers in `src/store/settings.ts` (mock localStorage with `vi.stubGlobal`)
- No need to test React components or Dexie hooks — those require complex browser mocks

**What NOT to test:**
- `src/lib/gemini.ts` — external API, mock would add no value
- React components — stick to logic unit tests
- Dexie queries — IndexedDB in jsdom is unreliable
