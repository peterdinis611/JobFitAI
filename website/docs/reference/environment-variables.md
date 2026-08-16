---
sidebar_position: 4
---

# Environment variables

## Required (app / agent)

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local`, Vercel | Convex deployment URL (client) |
| `CONVEX_URL` | `.env.local`, Vercel, agent | Same URL for server/agent tools |
| `OPENAI_API_KEY` | `.env.local`, Vercel | OpenAI key for GPT-4.1 scoring and career tools |

Set Convex URLs to your deployment, e.g. `https://happy-animal-123.convex.cloud`.

```bash
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_URL=https://<deployment>.convex.cloud
OPENAI_API_KEY=sk-...
```

## Convex dashboard

Configure in Convex project settings → Environment variables (for Convex functions and auth).

| Variable | Required | Description |
|----------|----------|-------------|
| `CLERK_JWT_ISSUER_DOMAIN` | Yes (auth) | Clerk Frontend API URL (e.g. `https://…clerk.accounts.dev`) |

## Next.js / Clerk (`.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (server only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Usually `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Usually `/sign-up` |

Activate [Clerk ↔ Convex](https://dashboard.clerk.com/apps/setup/convex) so JWTs work with Convex.

## Optional

| Variable | Description |
|----------|-------------|
| `DOCS_URL` | Production site URL for Docusaurus sitemap (build time) |

## Local development

1. Create `.env.local` in the repo root  
2. Fill Convex URLs from `npx convex dev`  
3. Add `OPENAI_API_KEY` from the OpenAI dashboard  
4. Restart `npm run dev` after changes  

## Agent / eve

The eve channel reads `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` in `agent/lib/convex.ts` for `ConvexHttpClient`. The LLM reads `OPENAI_API_KEY` via the Vercel AI SDK OpenAI provider.

:::caution
Never commit `.env.local` or secrets to git.
:::

## Checklist before first analysis

- [ ] Both Convex URLs set and identical  
- [ ] `npx convex dev` running  
- [ ] `OPENAI_API_KEY` set  
- [ ] `npm run dev` restarted after env changes  
