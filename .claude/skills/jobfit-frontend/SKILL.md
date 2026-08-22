---
name: jobfit-frontend
description: >-
  Builds JobFit UI — macOS app shell, auth signal deck, dashboard onboard states,
  shadcn/mac patterns. Use for pages, components, restyling, empty states, or
  landing/auth/dashboard work.
---

# JobFit Frontend

## Design direction

Commit to **one bold aesthetic** per surface (see workspace frontend-aesthetics rule):

- **Auth landing** (`.auth-deck`): Bricolage + Literata + JetBrains Mono, signal-dial instrument, CSS-first motion.
- **App shell** (logged-in): macOS window chrome — `.mac-window`, `.mac-titlebar`, `.mac-panel`, SF-style system stack.
- **Dashboard empty** (`.dash-onboard`): signal-deck language inside mac shell; scope fonts via `authFontVariables`.

Never ship generic AI slop. No Inter/Roboto/Space Grotesk on marketing surfaces.

## Component patterns

| Pattern | Classes / files |
|---------|-----------------|
| Window card | `.mac-window` + optional `.mac-titlebar` + traffic lights |
| Page title | `PageHeader` + `.mac-large-title` |
| Metrics row | `MetricStrip` |
| Primary CTA (onboard) | `.dash-onboard-btn-primary` / `-secondary` |
| Auth CTAs | `.auth-btn-primary` / `.auth-btn-secondary` native `<a>` |

## Performance defaults

1. **CSS animations** over `motion/react` on auth landing and empty states when possible.
2. **Lazy-load** heavy visuals only (`MatchDial`, illustrations) — hero copy must paint immediately.
3. **Native HTML** on auth landing: `<a>`, inline SVG icons, no Clerk buttons on marketing hero.
4. **Direct imports** for above-the-fold auth shell; avoid extra `dynamic()` gates that block LCP.
5. **Toast feedback** for blocked actions (e.g. no resume → `toast.error` + link to `/resumes`).

## File map

```
components/layout/app-shell.tsx     Nav + auth gate
components/auth/                    Landing + sign-in shell
components/dashboard/               History empty, quick start, sample report
components/analyze/                 Analyze setup + progress
app/globals.css                     .mac-*, .auth-*, .dash-onboard-*
hooks/use-run-analysis.ts           Start match from dashboard
lib/sample-job-posting.ts           Demo job for onboarding
```

## Empty state logic (History)

Use `HistoryEmptyState` + `HistoryEmptyMetrics` on `app/(home)/page.tsx`:

- No resume → onboarding steps + sample preview
- Has resume, 0 analyses → quick start + sample report timeline
- Pass real `hasResume`, `activeResumeName`, `resumes` — never hardcode `hasResume={false}`

## Checklist

- [ ] Uses existing CSS tokens (`--primary`, `--border`, `--mac-titlebar`)
- [ ] Dark + light both readable
- [ ] No new heavy deps for animation/icons unless necessary
- [ ] `bun run typecheck` clean

## More detail

- [ui-patterns.md](references/ui-patterns.md)
