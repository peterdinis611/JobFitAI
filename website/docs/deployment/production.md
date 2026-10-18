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
2. Framework: **Next.js**. Node **24.x**. Do **not** use a `vercel.json` `services` graph — Vercel Services reject Edge output (`opengraph-image`, Clerk `proxy.ts`).
3. Build command: `npm run build` / `bun run build`. `withEve()` mounts eve at `/eve/v1/*` during `next build`.
4. Set environment variables (Production + Preview):
   - `NEXT_PUBLIC_CONVEX_URL` — **production** Convex URL
   - `CONVEX_URL` — same URL (agent / server)
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` — `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — `/sign-up`
   - `NEXT_PUBLIC_SITE_URL` — public origin (`https://job-fit-ai-mocha.vercel.app`)
5. Pin **eve 0.27.6**. `0.24.x` ships an incomplete Vercel function so `/eve/v1/health` is `FUNCTION_INVOCATION_FAILED`. Do not jump to `0.51+` (`send({ message })` broke).
6. Browser calls send the Clerk session JWT (`Authorization: Bearer`) via `useJobFitAgent`. Do not add `none()` in production.
7. Push, then **Redeploy → Clear cache**. `curl -i https://<app>/eve/v1/health` must return **200**. Session without login is **401**.

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
- [ ] `OPENAI_API_KEY`, Clerk keys, and `NEXT_PUBLIC_SITE_URL` set on the whole Vercel project
- [ ] `/eve/v1/health` returns 200 after a cache-cleared redeploy
- [ ] `npm run build` succeeds locally
- [ ] `/docs` loads after deploy
- [ ] Analysis run completes end-to-end (History + Tracker populated)

[Docs site development →](./docs-site)
