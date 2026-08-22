# eve Agent App

This project uses the eve framework. Before writing code, read the relevant guide
from the installed eve package docs. In most installs, those docs are at
`node_modules/eve/docs/`. In workspaces or local package installs, resolve the
installed `eve` package location first and read its `docs/` directory. If
package docs are unavailable, use https://eve.dev/docs as a fallback.

## Agent skills

Project skills live in **`.cursor/skills/`** (Cursor) and **`.claude/skills/`** (Claude Code — keep in sync).

Start with **`jobfit`** router, then the most specific skill:

| Skill | Use for |
|-------|---------|
| `jobfit-frontend` | UI, mac shell, auth landing, dashboard |
| `jobfit-eve-agent` | Agent tools, analyze-match pipeline |
| `jobfit-clerk-convex` | Clerk + Convex auth |
| `jobfit-performance` | Bundle, loading, LCP |
| `jobfit-verify` | lint / typecheck / test before done |
| `convex` | Backend — routes to `convex-*` skills |

After editing skills: `bun run skills:sync`

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
