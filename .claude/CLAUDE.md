# JobFit AI — Claude Code

@../AGENTS.md

## Agent skills

Read the matching skill **before** implementing. Skills live in `.claude/skills/` (mirrored from `.cursor/skills/`).

| Skill | When |
|-------|------|
| `jobfit` | Router — start here if unsure |
| `jobfit-frontend` | UI, pages, auth landing, dashboard empty states |
| `jobfit-eve-agent` | Agent tools, analyze-match, streaming |
| `jobfit-clerk-convex` | Auth loops, Clerk + Convex JWT |
| `jobfit-performance` | Bundle size, loading, LCP |
| `jobfit-verify` | lint / typecheck / test gates |
| `convex` | Backend — then specific `convex-*` skill |

## Convex

Always read `convex/_generated/ai/guidelines.md` before Convex edits.

Install or refresh official Convex AI files:

```bash
npx convex ai-files install
```

## Commands (Bun)

```bash
bun run typecheck
bun run lint
bun run test
bun run dev
```

## Sync skills

After editing `.cursor/skills/`, mirror to Claude:

```bash
bun run skills:sync
```
