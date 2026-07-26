---
sidebar_position: 1
---

# Installation

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 24.x |
| npm | 10+ |
| Convex account | [convex.dev](https://convex.dev) |
| OpenAI API key | [platform.openai.com](https://platform.openai.com) |

Optional: [Vercel](https://vercel.com) account for deployment.

## Clone and install

```bash
git clone <your-repo-url>
cd jobfit-ai
npm install
cd website && npm install && cd ..
```

## Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_URL=https://<deployment>.convex.cloud
OPENAI_API_KEY=sk-...
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex client (browser) |
| `CONVEX_URL` | Yes | Convex server + agent tools |
| `OPENAI_API_KEY` | Yes | Agent LLM (`gpt-4.1`) for scoring and career tools |

Get Convex URLs from `npx convex dev` output or the Convex dashboard.

:::tip
Full variable list: [Environment variables](../reference/environment-variables).
:::

## Start Convex

```bash
npx convex dev
```

This pushes your schema, generates types in `convex/_generated/`, and keeps the backend in sync. Leave it running while developing.

## Start the app

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account on first visit (email + password, min. 8 characters).

## Verify the stack

| Check | How |
|-------|-----|
| App loads | `http://localhost:3000` shows sign-in |
| Convex connected | No “Convex URL missing” errors in terminal |
| Agent can score | Run an analysis; stream shows parse → score → save |
| Unit + Convex tests | `npm test` / `bun run test` |
| Lint / format | `npm run lint` / `npm run lint:fix` |
| Docs | `npm run build:docs` then open `/docs` |

## Build documentation locally

```bash
npm run build:docs
```

Docs are served at [http://localhost:3000/docs](http://localhost:3000/docs) from the static build in `public/docs/`.

For live reload while editing docs:

```bash
npm run dev:docs   # http://localhost:3001/docs/
```

## Project layout

```
jobfit-ai/
├── agent/           # eve agent (instructions, skills, tools)
├── app/             # Next.js routes
├── components/      # UI components (shadcn/ui)
├── convex/          # Backend schema + functions
├── lib/             # Shared utilities + Zod schemas
├── website/         # Docusaurus docs (this site)
└── public/docs/     # Built docs output (generated)
```

## Common install issues

| Symptom | Fix |
|---------|-----|
| Missing Convex URL | Copy URL from `npx convex dev` into `.env.local` |
| Analysis fails / no LLM | Set `OPENAI_API_KEY` and restart `npm run dev` |
| Auth errors on sign-up | Ensure `npx convex dev` finished schema push |
| `/docs` 500 | Run `npm run build:docs` |

More: [Troubleshooting](../help/troubleshooting).

## Next step

[Run your first analysis →](./first-analysis)
