---
sidebar_position: 2
---

# Agent pipeline

The eve agent follows skills (playbooks) and calls typed tools. Never guesses resume or job content.

## Core analysis flow

**Skill:** `analyze-match`

| Step | Tool | Notes |
|------|------|-------|
| 1 | `parse_resume` | PDF/DOCX → plain text via Effect |
| 2 | `fetch_job_posting` | URL only — HTTPS, sanitized HTML |
| 3 | `update_job_posting` | Persist title + cleaned text |
| 4 | `score_match` | LLM structured scoring |
| 5 | `save_analysis` | Insert `analyses` row |

## Post-analysis flows

| Skill | Tools |
|-------|-------|
| `tailor-cv` | parse_resume → tailor_bullets → save_artifact |
| `generate-cover-letter` | parse_resume → generate_cover_letter → save_artifact |
| `generate-learning-plan` | generate_learning_plan → save_artifact |
| `rescore-after-edit` | parse_resume → score_match → save_analysis (+ previousAnalysisId) |

## Effect + Zod

Tools use [Effect](https://effect.website) for retries/timeouts and [Zod](https://zod.dev) schemas from `lib/schemas/tools.ts` for input/output validation.

## Convex from tools

Agent tools use `ConvexHttpClient` (no user JWT) with explicit `userId` in agent-trusted mutations like `save_analysis`.

## Model

Default: `anthropic/claude-sonnet-5` via AI Gateway in `score_match` and generation tools.

## Instructions

Always-on prompt: `agent/instructions.md` — recruiter persona, scoring rules, tool order, safety constraints.

[Tools reference →](../reference/agent-tools) · [Skills reference →](../reference/agent-skills)
