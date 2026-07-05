---
sidebar_position: 2
---

# Agent skills

Skills are markdown playbooks in `agent/skills/`. The agent loads them on demand per task.

## Analysis

### `analyze-match`

Full resume vs. job analysis. Steps: parse → (fetch + update if URL) → score → save.

### `extract-job-requirements`

Parse unstructured job text into must-haves, nice-to-haves, seniority, domain. Used when job text is long or messy.

## Career tools

### `tailor-cv`

Rewrite 3–5 bullets; save as `tailored_bullets` artifact; show before/after.

### `generate-cover-letter`

Draft cover letter from analysis context; save as `cover_letter` artifact.

### `generate-learning-plan`

2-week plans per missing skill; save as `learning_plan` artifact.

### `rescore-after-edit`

Re-run match with new resume version; pass `previousAnalysisId`; report delta.

## Loading skills

From `agent/instructions.md`:

> Load skills on demand — `analyze-match` for full analysis; `tailor-cv`, `generate-cover-letter`, etc. for post-analysis actions.

The UI triggers skills via `agent.send()` with context JSON and explicit skill name in the message.

## Authoring new skills

1. Add `agent/skills/your-skill.md` with steps and quality checks
2. Add or reuse tools in `agent/tools/`
3. Wire UI button with context JSON
4. Document here
