---
sidebar_position: 7
---

# Career tools

Available on every analysis report under **Career tools**.

All tools run through the eve agent, persist results to Convex `artifacts`, and display in tabs on the report page.

## Tailor bullets

**Skill:** `tailor-cv`

Rewrites **3–5 resume bullets** for the specific job:

1. `parse_resume` — fresh CV text
2. `tailor_bullets` — LLM rewrite with before/after pairs
3. `save_artifact` — type `tailored_bullets`

**Tab:** Before/after cards with optional rationale per bullet.

:::warning
Bullets are suggestions — verify accuracy before using on a real application. The agent won't invent employers but may suggest metrics you should confirm.
:::

## Cover letter

**Skill:** `generate-cover-letter`

One-click draft (~250–400 words) using resume, job text, match %, skills, and gaps.

**Tab:** Full letter text, copy-friendly.

## Learning plan

**Skill:** `generate-learning-plan`

For each missing skill (up to ~5), a **2-week plan** with concrete steps:

- Official docs / tutorials
- Small projects
- Practice exercises

Example output format:

> **To close GraphQL gap:** 2-week plan  
> 1. Week 1: Read official GraphQL docs…  
> 2. Week 1: Build hello-world query…

## Re-score

**Skill:** `rescore-after-edit`

1. Upload a **new CV version** (PDF/DOCX)
2. Agent re-runs `parse_resume` → `score_match` → `save_analysis`
3. New analysis stores `previousAnalysisId`
4. New report shows **delta banner** vs. old score

Use after tailoring your CV based on recommendations.

## Save to tracker

Creates an `applications` row in **Saved** status linked to this analysis. No agent call — instant Convex mutation.

[Agent skills reference →](../reference/agent-skills)
