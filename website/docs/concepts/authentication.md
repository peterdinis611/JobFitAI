---
sidebar_position: 2
---

# Authentication

JobFit AI uses [Convex Auth](https://labs.convex.dev/auth) with email + password.

## Sign up / sign in

- Email + password (minimum 8 characters)
- Separate sign-up and sign-in flows
- Session managed by `ConvexAuthProvider` on the client

## Server-side enforcement

All Convex queries and mutations call `requireUserId()` — the client never passes a trusted `userId` (except agent tools that run server-side with explicit IDs from session context).

## Protected routes

The app shell shows `AuthScreen` until `useConvexAuth()` reports authenticated. All pages (`/`, `/analyze`, `/resumes`, `/tracker`, etc.) require login.

## Docs

Documentation at `/docs` is **public** — served as static files, no auth required.

## User records

Auth tables from `@convex-dev/auth` plus an extended `users` table for app data. Resume and analysis rows are scoped by `userId`.

:::note
Password reset and email verification are not enabled yet. Only email + password sign-in is supported.
:::

[Environment variables →](../reference/environment-variables)
