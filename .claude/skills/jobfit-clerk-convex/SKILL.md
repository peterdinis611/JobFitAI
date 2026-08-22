---
name: jobfit-clerk-convex
description: >-
  Configures Clerk + Convex auth for JobFit — AppShell gate, JWT issuer, sign-in
  redirects, ConvexAuthMismatch. Use for login loops, session sync, or protected routes.
---

# JobFit Clerk + Convex Auth

## Architecture

- **Clerk** — browser session (`@clerk/nextjs`)
- **Convex** — data auth via Clerk JWT template (`applicationID: "convex"`)
- **Bridge** — `useJobFitUser()` ensures Convex user row exists

## AppShell gate (`components/layout/app-shell.tsx`)

1. Clerk loading → `ShellLoading`
2. Clerk signed out → `AuthScreen` (not Convex `<Unauthenticated>` alone)
3. Clerk signed in + Convex loading → `ShellLoading`
4. Clerk signed in + Convex unauthenticated → **`ConvexAuthMismatch`** (not redirect loop)
5. Both OK → app chrome + `<Authenticated>` children

**Never** gate the whole app only on Convex `<Unauthenticated>` when Clerk already has a session.

## Convex config

`convex/auth.config.ts`:

```ts
domain: process.env.CLERK_JWT_ISSUER_DOMAIN!  // Clerk Frontend API URL
applicationID: "convex"
```

Set `CLERK_JWT_ISSUER_DOMAIN` on **Convex deployment** (dev + prod). User must enable [Clerk Convex integration](https://dashboard.clerk.com/apps/setup/convex) and sign out/in after setup.

## Sign-in pages

- `app/sign-in/`, `app/sign-up/` — set redirect URLs back to app origin
- Marketing auth uses native links to `/sign-in`, `/sign-up` — not embedded Clerk on landing hero

## Protected Convex functions

Use `requireUser` / `requireUserId` from `convex/lib/auth.ts` in mutations/queries.

Agent tools without user JWT pass `userId` explicitly and use `*ForAgent` queries.

## Debugging auth loops

| Symptom | Likely fix |
|---------|------------|
| Bounce `/` ↔ `/sign-in` | Fix AppShell gate + Convex JWT issuer |
| Clerk OK, app stuck | Show ConvexAuthMismatch; check integration dashboard |
| Convex queries return empty | `users.ensureCurrentUser` not run — check `useJobFitUser` |

## Checklist

- [ ] No secrets committed
- [ ] `.env.example` documents required Clerk/Convex vars
- [ ] Middleware (`proxy.ts` / `middleware.ts`) aligns with Clerk docs
