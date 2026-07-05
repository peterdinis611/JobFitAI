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

Open [http://localhost:3000](http://localhost:3000). Docs: [http://localhost:3000/docs/](http://localhost:3000/docs/) (run `npm run build:docs` first).

### Documentation

Docs are built with [Docusaurus](https://docusaurus.io/) and served as static files at `/docs/`.

```bash
# Build docs into public/docs (required before first visit, and after doc edits)
npm run build:docs

# Optional — live reload while editing website/docs/
npm run dev:docs   # then open http://localhost:3001/docs/
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
