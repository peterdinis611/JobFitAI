# UI reference

## mac titlebar snippet

```tsx
<div className="mac-titlebar">
  <div className="mac-traffic-lights" aria-hidden>
    <span /><span /><span />
  </div>
  <span className="text-[11px] text-muted-foreground uppercase">Label</span>
</div>
```

## Scoped auth fonts (dashboard onboard only)

```tsx
import { authFontVariables } from "@/components/auth/auth-fonts"

<div className={cn("dash-onboard mac-window", authFontVariables)}>...</div>
```

## Analysis card score tone

Use `matchToneClass` from `@/lib/role-label` for percentage color.

## Avoid

- `AppPreloader` / multi-layer boot overlays (removed — use `ShellLoading` only)
- Gating entire auth landing behind `dynamic(AuthScreen)`
- Lucide on auth marketing sections (use inline SVG like `OnboardIcon`)
