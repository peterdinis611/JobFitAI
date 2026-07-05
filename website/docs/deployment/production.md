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

1. Connect GitHub repo
2. Set environment variables:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_URL`
3. Build command: `npm run build` (includes `build:docs`)
4. `withEve()` in `next.config.ts` handles eve integration

## Build pipeline

```bash
npm run build:docs   # Docusaurus → public/docs/
next build           # Next.js app
```

Single `npm run build` runs both.

## Docs in production

Static files in `public/docs/` are served at `/docs` via Next.js static file handling + rewrite rules in `next.config.ts`.

No separate Docusaurus server in production.

## Checklist

- [ ] Convex deployed with latest schema
- [ ] Auth working on production URL
- [ ] Convex env vars on Vercel
- [ ] `npm run build` succeeds locally
- [ ] `/docs` loads after deploy
- [ ] Analysis run completes end-to-end

[Docs site development →](./docs-site)
