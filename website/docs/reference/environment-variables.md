---
sidebar_position: 4
---

# Environment variables

## Required (app)

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local`, Vercel | Convex deployment URL (client) |
| `CONVEX_URL` | `.env.local`, Vercel, agent | Same URL for server/agent tools |

Set both to your Convex deployment URL, e.g. `https://happy-animal-123.convex.cloud`.

## Convex dashboard

Configure in Convex project settings → Environment variables (for Convex functions and auth).

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Auto | Set by `@convex-dev/auth` init |

## Optional

| Variable | Description |
|----------|-------------|
| `DOCS_URL` | Production site URL for Docusaurus sitemap (build time) |

## Local development

```bash
cp .env.example .env.local
# Fill in CONVEX URLs from `npx convex dev`
```

## Agent / eve

The eve channel reads `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` in `agent/lib/convex.ts` for `ConvexHttpClient`.

:::caution
Never commit `.env.local` or secrets to git.
:::
