---
sidebar_position: 1
---

# Matching scores

How JobFit AI calculates and interprets match percentages.

## Scoring pipeline

1. **Parse** resume text from PDF/DOCX
2. **Extract** job requirements (explicit or via `extract-job-requirements` skill)
3. **Score** via `score_match` — Claude Sonnet with structured Zod output
4. **Heuristic hints** — keyword overlap for common tech skills (verified by LLM, not copied blindly)

## Match percentage bands

| Range | Interpretation |
|-------|----------------|
| **90%+** | Strong fit — most must-haves covered |
| **70–89%** | Good fit — addressable gaps |
| **50–69%** | Stretch — significant missing skills |
| **&lt;50%** | Poor fit — major misalignment |

Must-have skills weigh more than nice-to-haves in the model prompt.

## Seniority fit

| Value | Meaning |
|-------|---------|
| `under` | Candidate below required level |
| `match` | Aligned with role level |
| `over` | Potentially overqualified |

## Skill categories

When available, the radar chart breaks scores into categories (e.g. technical, soft skills, domain). Each category includes matched and missing skill lists.

## Red flags

Evidence-based concerns, such as:

- Missing must-have technologies
- Seniority mismatch
- Employment gaps vs. role expectations
- Title inflation without supporting experience

## Recommendations

Actionable CV edits — keywords to add, projects to highlight, bullets to rewrite. Not generic advice like "learn more."

## Honesty principle

The agent instructions require fair scoring. Inflated percentages hurt more than honest gaps — use recommendations and career tools to close them.
