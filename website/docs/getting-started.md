---
sidebar_position: 2
---

# Getting started

## Prerequisites

- Node.js 24.x
- A [Convex](https://convex.dev) account

## Install

```bash
git clone <repo>
cd jobfit-ai
npm install
cd website && npm install && cd ..
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
CONVEX_URL=https://<your-deployment>.convex.cloud
```

## Run locally

**Terminal 1 — Convex**

```bash
npx convex dev
```

**Terminal 2 — Next.js + eve agent**

```bash
npm run dev
```

**Terminal 3 — Docs (optional, for `/docs` in dev)**

```bash
npm run dev:docs
```

Open [http://localhost:3000](http://localhost:3000) for the app and [http://localhost:3000/docs](http://localhost:3000/docs) for documentation (proxied to Docusaurus on port 3001 in development).

## Deploy

```bash
npm run build   # builds docs into public/docs, then Next.js
```

- **Vercel**: connect the repo; set Convex env vars. The build script includes Docusaurus output.
- **Convex**: `npx convex deploy`

## Rate limits

Each user is limited to **20 analyses per day** (server-side in Convex).
