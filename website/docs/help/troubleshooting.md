---
sidebar_position: 2
---

# Troubleshooting

## App won't start

**Convex URL missing**

```
Error: CONVEX_URL or NEXT_PUBLIC_CONVEX_URL must be set
```

→ Run `npx convex dev`, copy URL to `.env.local`, restart `npm run dev`.

**Auth crash on sign-up**

→ Ensure Clerk is signed in, Convex has `CLERK_JWT_ISSUER_DOMAIN`, and the Clerk Convex integration is active. Sign out and back in after enabling the integration. Run `npx convex dev --once`.

## Analysis fails

**"Upload an active resume first"**

→ Go to Resumes, upload a PDF/DOCX.

**"Daily analysis limit reached"**

→ Wait until next UTC day or check `rateLimits` table in Convex dashboard.

**Agent stream stops / tool error**

→ Check the terminal running `npm run dev` for eve errors. Verify Convex is running and `OPENAI_API_KEY` is set.

**OpenAI / model errors**

```
API key / unauthorized / model
```

→ Set `OPENAI_API_KEY` in `.env.local` and restart the Next/eve process. Confirm the key has access to `gpt-4.1`.

**URL fetch failed**

→ Paste job text manually. Only HTTPS URLs supported.

**Save succeeded in stream but nothing in History**

→ Unlikely if `analyses.create` committed; hard-refresh History. If still empty, check Convex dashboard → `analyses` for your user. Older failed saves (invalid empty IDs) never wrote a row — re-run Analyze.

**History OK, Tracker empty**

→ See [History vs Tracker](../concepts/history-vs-tracker). Use Save to tracker on the report, or re-run analysis for auto-track.

## UI issues

**Analyze panels overlapping / layout broken**

→ Hard refresh. Setup and progress use a responsive flex layout (left setup ~360px on large screens).

**Role always “Untitled role”**

→ Paste with title on the first line. [Role titles](../concepts/role-titles).

**Drag-and-drop on Tracker does nothing**

→ Drop on the column area; ensure you're signed in. Check browser console for mutation errors.

## Docs (`/docs`)

**Internal Server Error on `/docs`**

→ Static serve from `public/docs/`. Run:

```bash
npm run build:docs
```

Restart `npm run dev`.

**404 on subpages like `/docs/getting-started`**

→ Rebuild docs. Next.js rewrites map paths to `index.html` files. Paths with file extensions (e.g. `search-index.json`) are not rewritten.

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
3. Verify terminals: `npx convex dev`, `npm run dev`  
4. Confirm `.env.local` has Convex URLs **and** `OPENAI_API_KEY`  
