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
```

Get these values from `npx convex dev` output or the Convex dashboard.

## Start Convex

```bash
npx convex dev
```

This pushes your schema, generates types in `convex/_generated/`, and keeps the backend in sync.

## Start the app

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account on first visit (email + password, min. 8 characters).

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

## Next step

[Run your first analysis →](./first-analysis)
