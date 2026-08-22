---
name: jobfit-performance
description: >-
  Optimizes JobFit Next.js bundle, loading, and runtime — optimizePackageImports,
  lazy boundaries, CSS-first motion, caching. Use for slow pages, large bundles, or LCP work.
---

# JobFit Performance

## Next.js config (`next.config.ts`)

Already configured — extend, don't regress:

- `experimental.optimizePackageImports` for radix-ui, clerk, motion, tiptap, lucide, recharts, sonner, cmdk, next-themes
- `productionBrowserSourceMaps: true`
- `poweredByHeader: false`
- AVIF/WebP images; Clerk CDN `remotePatterns`
- Docs assets: long-cache headers under `/docs/assets`

Wrapped with `withEve` — required for agent routes.

## Loading strategy

| Area | Rule |
|------|------|
| Auth landing | Direct `AuthScreen` import; lazy only `MatchDial` |
| App shell | `ShellLoading` — lightweight CSS, no lottie preloader |
| Empty states | CSS `@keyframes auth-rise`, no motion bundle |
| Analyze progress | motion OK — below fold / after interaction |
| Icons | Inline SVG on hot paths; lucide elsewhere in app |

## Bundle hygiene

1. Add new heavy libs to `optimizePackageImports` if barrel-imported.
2. Prefer `import { X } from "package/subpath"` when tree-shaking fails.
3. Avoid duplicate auth/font loaders — scope `authFontVariables` to `.auth-deck` / `.dash-onboard` wrappers only.
4. Don't re-introduce `AppPreloader` or stacked boot overlays.

## Data / Convex

- Use `"skip"` in `useQuery` until `useJobFitUser().ready`
- Avoid N+1 queries on History list — use existing `listByUser` join patterns
- For Convex hot paths see `convex-performance-audit` skill

## Verify impact

```bash
bun run build          # watch route bundle sizes
bun run typecheck
bun run test
```

Use Chrome DevTools Performance + Network on `/`, `/sign-in`, `/analyze` after changes.

## Checklist

- [ ] LCP element not blocked by client-only dynamic import
- [ ] No new full-screen loading gates above content
- [ ] Fonts use `display: "swap"`
