---
name: jobfit-verify
description: >-
  Runs JobFit quality gates — Biome lint, TypeScript, Vitest. Use before finishing
  tasks, after refactors, or when the user asks if the change is safe to merge.
---

# JobFit Verify

## Standard gate (run after substantive edits)

```bash
bun run typecheck   # tsc --noEmit
bun run lint        # biome check .
bun run test        # vitest run
```

Fix failures before marking work complete. Do not skip hooks on commit unless user explicitly requests.

## When to run what

| Change | Minimum |
|--------|---------|
| UI-only CSS/components | typecheck + lint |
| lib/ or hooks/ logic | + test (add test if behavior is new) |
| convex/ | typecheck + test (convex-test in vitest) |
| agent/tools | test + manual analyze smoke on `/analyze` |

## Tooling notes

- **Linter**: Biome (`biome.json`) — not ESLint
- **Tests**: Vitest (`vitest.config.ts`), files in `__tests__/` mirroring `lib/`, `agent/`, `convex/`
- **Package manager**: Bun (scripts assume bun)

## Auto-fix

```bash
bun run lint:fix
bun run format
```

## Convex AI files

If Convex patterns seem stale:

```bash
npx convex ai-files install
```

Refreshes `convex/_generated/ai/guidelines.md`.

## PR readiness

- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes (or only pre-existing unrelated failures documented)
- [ ] `bun run test` passes
- [ ] No `.env.local` secrets staged
- [ ] Diff scoped to requested task
