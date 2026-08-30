---
sidebar_position: 1
---

# Production deployment

## Convex

```bash
npx convex deploy
```

Ensure production env vars match your Vercel (or host) deployment.

## Vercel (Next.js + eve)

1. Connect the GitHub repo (root = this project, not `website/`)
2. Framework: **Next.js**. Node **24.x** (from `package.json` `engines`)
3. Build command: `npm run build` or `bun run build` (docs + Next)
4. Set environment variables (Production + Preview):
   - `NEXT_PUBLIC_CONVEX_URL` — **production** Convex URL
   - `CONVEX_URL` — same URL (agent / server)
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` — `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — `/sign-up`
5. `withEve()` in `next.config.ts` handles eve — no separate eve server

On Convex **production**, set `CLERK_JWT_ISSUER_DOMAIN`. Add the Vercel URL to Clerk allowed origins / redirect URLs.

## Build pipeline

```bash
npm ci --prefix website   # website/ is not a workspace — required on Vercel
npm run build --prefix website
node scripts/copy-docs.mjs   # → public/docs/
next build
```

`public/docs/` is gitignored. `npm run build` / `bun run build` installs Docusaurus deps, builds docs, then Next.js.

## Docs in production

Static files in `public/docs/` are served at `/docs` via Next.js static file handling + rewrite rules in `next.config.ts`.

No separate Docusaurus server in production.

## Checklist

- [ ] Convex deployed with latest schema
- [ ] Auth working on production URL
- [ ] Convex env vars on Vercel
- [ ] `OPENAI_API_KEY` set on the host running eve/Next
- [ ] `npm run build` succeeds locally
- [ ] `/docs` loads after deploy
- [ ] Analysis run completes end-to-end (History + Tracker populated)

[Docs site development →](./docs-site)
