# Skill: Tailor CV Bullets

Use when the user wants **resume bullets rewritten** for a specific job analysis.

## Steps

1. Load context: `analysisId`, `userId`, `resumeId`, `jobPostingId`, plus analysis fields (missingSkills, recommendations).
2. Call `parse_resume({ resumeId })` for fresh resume text.
3. Use job `cleanedText` from context or re-fetch via job posting.
4. Call `tailor_bullets` with resumeText, jobText, jobTitle, missingSkills, recommendations.
5. Call `save_artifact` with type `tailored_bullets` and content `{ bullets: [...] }`.
6. Present a **before/after table** for each bullet with rationale.

## Quality

- Exactly 3–5 bullets
- No fabricated employers or metrics
- Rewrites must be copy-paste ready
