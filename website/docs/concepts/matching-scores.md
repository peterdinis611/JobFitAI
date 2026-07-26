---
sidebar_position: 1
---

# Matching scores

How JobFit AI calculates and interprets match percentages.

## Scoring pipeline

1. **Parse** resume text from PDF/DOCX  
2. **Extract** job requirements (explicit in the posting or via agent skills)  
3. **Score** via `score_match` — OpenAI GPT-4.1 with structured Zod output  
4. **Heuristic hints** — keyword overlap for common tech skills (verified by the LLM, not copied blindly)  

## Match percentage bands

| Range | Interpretation |
|-------|----------------|
| **90%+** | Strong fit — most must-haves covered |
| **70–89%** | Good fit — addressable gaps |
| **50–69%** | Stretch — significant missing skills |
| **&lt;50%** | Poor fit — major misalignment |

Must-have skills weigh more than nice-to-haves in the model prompt.

## Seniority fit

| Agent value | UI label | Meaning |
|-------------|----------|---------|
| `under` | Below target | Candidate below required level |
| `match` | Right level | Aligned with role level |
| `over` | Above target | Potentially overqualified |

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

## Improving a score

1. Read **Missing skills** and **Red flags**  
2. Run **Tailor bullets** and update your CV honestly  
3. **Re-score** to measure the delta  
4. Optionally generate a **Learning plan** for real skill gaps  

[Career tools →](../user-guide/career-tools) · [Recommended workflow →](../getting-started/recommended-workflow)
