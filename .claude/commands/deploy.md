# Deploy

Build and deploy the app to Cloudflare Pages.

## Steps

1. Run `npm run build` — this runs `tsc -b && vite build`
   - Fix any TypeScript errors before proceeding
   - Build output goes to `dist/`
2. Run `npm test` to make sure tests still pass
3. Run `npx wrangler pages deploy dist --project-name diet-tracker`
4. Report the deployment URL from the Wrangler output

## Notes

- Project name: `diet-tracker`
- Live URL: https://diet-tracker-f3b.pages.dev (canonical)
- Each deploy also gets a unique preview URL (shown in Wrangler output)
- The deploy command is also available as `npm run deploy` (runs build + deploy together)

## If the build fails

- TypeScript errors: fix them in source, do not use `// @ts-ignore` unless truly necessary
- PWA manifest errors: check `vite.config.ts`
- If `wrangler` is not authenticated: user needs to run `wrangler login` manually

## Quick single command

```bash
npm run deploy
```
