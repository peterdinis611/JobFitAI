---
sidebar_position: 3
---

# Rate limits

Analyses are rate-limited to control LLM and infrastructure costs.

## Limit

| Resource | Limit |
|----------|-------|
| Analyses per user | **20 / day** |

The window resets by calendar date (UTC date string in Convex).

## Implementation

Table: `rateLimits` — `(userId, date, analysisCount)`

Mutation: `rateLimits.checkAndIncrement` — called from the Analyze page before starting a run.

## When exceeded

The UI shows: **"Daily analysis limit reached (20/day)"** and the analysis does not start.

## Career tools

Tailor bullets, cover letter, and learning plan use the agent but do **not** currently increment the analysis counter (only full match runs on `/analyze` and re-score do).

:::info
Limits apply per authenticated user, not per IP.
:::
