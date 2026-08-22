---
name: jobfit
description: >-
  Routes JobFit AI tasks to the right project skill. Use for UI, eve agent,
  Clerk+Convex auth, performance, or when the user asks how to work in this repo.
---

# JobFit AI

Router for this codebase. Pick the most specific skill below.

## Always

1. Read `AGENTS.md` (eve + Convex pointers).
2. Prefer Bun: `bun run typecheck`, `bun run lint`, `bun run test`.
3. Minimize diff scope — match existing patterns in touched files.

## Route by task

| Task | Skill |
|------|--------|
| Pages, components, empty states, mac shell, auth landing | `jobfit-frontend` |
| eve agent, tools, analyze-match, streaming progress | `jobfit-eve-agent` |
| Clerk sign-in, Convex JWT, AppShell auth gate | `jobfit-clerk-convex` |
| Bundle size, loading, Next config, lazy imports | `jobfit-performance` |
| Before finishing — lint, types, tests | `jobfit-verify` |
| Convex schema, queries, migrations, perf | `convex` (then specific convex-* skill) |

## Key paths

```
app/                    Next.js App Router pages
components/             UI (auth/, dashboard/, analyze/, layout/)
convex/                 Backend — read _generated/ai/guidelines.md first
agent/                  eve agent, tools, skills
hooks/                  useJobFitUser, useRunAnalysis
lib/                    Shared utilities, SEO, analyze-stream
```

## Skills locations

- Cursor: `.cursor/skills/`
- Claude Code: `.claude/skills/` (keep in sync with `.cursor/skills/`)
