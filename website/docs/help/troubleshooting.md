---
sidebar_position: 2
---

# Troubleshooting

## App won't start

**Convex URL missing**

```
Error: CONVEX_URL or NEXT_PUBLIC_CONVEX_URL must be set
```

→ Run `npx convex dev`, copy URL to `.env.local`.

**Auth crash on sign-up**

→ Ensure schema includes `authTables` and `externalId` is optional on `users`. Run `npx convex dev --once`.

## Analysis fails

**"Upload an active resume first"**

→ Go to Resumes, upload a PDF/DOCX.

**"Daily analysis limit reached"**

→ Wait until next UTC day or check `rateLimits` table in Convex dashboard.

**Agent stream stops / tool error**

→ Check terminal running `npm run dev` for eve errors. Verify Convex is running.

**URL fetch failed**

→ Paste job text manually. Only HTTPS URLs supported.

## Docs (`/docs`)

**Internal Server Error on `/docs`**

→ Old config proxied to port 3001 without Docusaurus running. Fixed: static serve from `public/docs/`. Run:

```bash
npm run build:docs
```

Restart `npm run dev`.

**404 on subpages like `/docs/getting-started`**

→ Rebuild docs. Next.js rewrites map paths to `index.html` files.

**Stale content after edits**

→ `npm run build:docs` again (production build is static).

## Convex codegen

**`mutation` not exported from `_generated/server`**

→ Delete stale stub files, run `npx convex codegen`.

## TypeScript

```bash
npm run typecheck
```

Fix errors before deploy.

## Still stuck?

1. Check Convex dashboard → Logs
2. Check browser console + Network tab
3. Verify all three terminals: `convex dev`, `npm run dev`, (optional) `npm run dev:docs`
