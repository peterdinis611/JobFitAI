---
sidebar_position: 1
---

# Agent tools

Tools live in `agent/tools/`. Inputs/outputs defined in `lib/schemas/tools.ts`.

## Core pipeline

### `parse_resume`

Load resume from Convex storage; extract PDF/DOCX text.

| | |
|---|---|
| **Input** | `{ resumeId }` |
| **Output** | `{ resumeId, fileName, mimeType, parsedText, wordCount }` |

### `fetch_job_posting`

Fetch HTTPS URL, strip HTML, return clean text.

| | |
|---|---|
| **Input** | `{ url }` — HTTPS only, max 2048 chars |
| **Output** | `{ url, title?, cleanedText, wordCount }` |

### `update_job_posting`

Persist fetched job content + title.

| | |
|---|---|
| **Input** | `{ userId, jobPostingId, title?, cleanedText }` |

### `score_match`

LLM scoring with structured output.

| | |
|---|---|
| **Input** | `{ resumeText, jobText, jobTitle? }` |
| **Output** | match %, skills, seniority, flags, recommendations, skillCategories |

### `save_analysis`

Insert analysis row.

| | |
|---|---|
| **Input** | Score fields + `userId`, `resumeId`, `jobPostingId`, optional `previousAnalysisId` |
| **Output** | `{ analysisId }` |

## Career tools

### `tailor_bullets`

| **Output** | `{ bullets: [{ original, rewritten, rationale? }] }` — 3–5 items |

### `generate_cover_letter`

| **Output** | `{ coverLetter }` |

### `generate_learning_plan`

| **Output** | `{ plans: [{ skill, durationWeeks, steps[] }] }` |

### `save_artifact`

| **Input** | `{ userId, analysisId, type, content }` |
| **type** | `tailored_bullets` \| `cover_letter` \| `learning_plan` |
