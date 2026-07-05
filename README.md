# JobFit AI

AI agent that analyzes job postings against your resume and scores the match.

## Stack

- **Next.js** + **eve** (`--channel-web-nextjs`) — agent streams to UI via `useEveAgent`
- **Effect** — typed pipelines in `agent/tools/*`
- **Convex** — CV storage, analyses, rate limits
- **shadcn/ui** + Tailwind

## Setup

```bash
cd jobfit-ai
npm install

# Terminal 1 — Convex
npx convex dev

# Copy deployment URL to .env.local
cp .env.example .env.local
# Set NEXT_PUBLIC_CONVEX_URL and CONVEX_URL from convex dev output

# Terminal 2 — Next.js + eve
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Documentation

Docs are built with [Docusaurus](https://docusaurus.io/) and served at `/docs`.

```bash
# Dev — run alongside npm run dev (proxied via next.config rewrites)
npm run dev:docs

# Production build (included in npm run build)
npm run build:docs
```

See [website/docs/](./website/docs/) for source content.

## Project layout

Planning notes for contributors: [docs/PLANNING.md](./docs/PLANNING.md). User-facing docs: `/docs` (Docusaurus).

```
agent/          # eve agent (instructions, skills, tools)
convex/         # database schema + functions
app/            # Next.js pages
lib/schemas/    # shared Zod schemas
```

## Deploy

- **Vercel**: connect repo; set `NEXT_PUBLIC_CONVEX_URL` / `CONVEX_URL`; eve deploys with `withEve()` in `next.config.ts`.
- **Convex**: `npx convex deploy`

## Rate limit

20 analyses per user per day (client user id in localStorage until real auth is added).
