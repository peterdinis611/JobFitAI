---
sidebar_position: 1
---

# Authentication

JobFit AI uses [Clerk](https://clerk.com) for sign-in and [Convex](https://docs.convex.dev/auth/clerk) to validate Clerk JWTs on the backend.

## Flow

1. User signs in via Clerk (`/sign-in`, `/sign-up`, or landing CTAs)
2. `ClerkProvider` + `ConvexProviderWithClerk` attach a Convex JWT
3. `users.ensureCurrentUser` upserts a Convex `users` row keyed by Clerk `subject` (`externalId`)
4. Queries/mutations call `requireUserId()` which looks up that row

## Config

| Piece | Location |
|-------|----------|
| Next.js SDK | `@clerk/nextjs` |
| Middleware | `proxy.ts` (`clerkMiddleware`) |
| Convex JWT | `convex/auth.config.ts` + `CLERK_JWT_ISSUER_DOMAIN` on Convex |
| App user map | `users.externalId` = Clerk user id |

Activate the [Clerk ↔ Convex integration](https://dashboard.clerk.com/apps/setup/convex) so tokens include the Convex JWT template (`applicationID: "convex"`).

## UI

- Signed out: landing with **Sign in** / **Create account**
- Signed in: Clerk **UserButton** in the header
- Dedicated routes: `/sign-in`, `/sign-up`

Existing Convex Auth password accounts are not migrated — create a new Clerk account.
