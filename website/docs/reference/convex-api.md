---
sidebar_position: 3
---

# Convex API

Public Convex functions (authenticated unless noted).

## `analyses`

| Function | Type | Description |
|----------|------|-------------|
| `create` | mutation | Agent-only — insert analysis |
| `listByUser` | query | History with resume + job joins |
| `get` | query | Single analysis |
| `getWithRelations` | query | Analysis + resume + job |
| `getRescoreDelta` | query | % delta vs. previousAnalysisId |

## `resumes`

| Function | Type | Description |
|----------|------|-------------|
| `generateUploadUrl` | mutation | Storage upload URL |
| `create` | mutation | New resume version (auto-active) |
| `listByUser` | query | All versions |
| `get` | query | Single resume |
| `setActive` | mutation | Switch active CV |
| `updateParsedText` | mutation | Store parsed text |
| `getFileUrl` | query | Signed storage URL |

## `jobPostings`

| Function | Type | Description |
|----------|------|-------------|
| `create` | mutation | New posting (auto title for text) |
| `updateTitle` | mutation | User-facing title update |
| `updateFromFetch` | mutation | Agent — after URL fetch |
| `get` | query | Single posting |

## `applications`

| Function | Type | Description |
|----------|------|-------------|
| `listByUser` | query | Tracker with relations |
| `getByAnalysis` | query | Application for report |
| `create` | mutation | Save to tracker |
| `updateStatus` | mutation | Move kanban column |
| `remove` | mutation | Delete from tracker |

## `artifacts`

| Function | Type | Description |
|----------|------|-------------|
| `listByAnalysis` | query | All artifacts for report |
| `getByType` | query | Latest by type |
| `save` | mutation | Agent — upsert artifact |
| `saveForUser` | mutation | User-authenticated save |

## `rateLimits`

| Function | Type | Description |
|----------|------|-------------|
| `checkAndIncrement` | mutation | Daily quota check |

## `users`

| Function | Type | Description |
|----------|------|-------------|
| `viewer` | query | Current user profile |

All user-scoped functions use `requireUserId()` from `convex/lib/auth.ts`.
