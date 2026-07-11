# Skill: Tailor CV Bullets

Use when the user wants **resume bullets rewritten** for a specific job analysis.

## Steps

1. Load context: `analysisId`, `userId`, `resumeId`, `jobPostingId`, plus analysis fields (missingSkills, recommendations).
2. Call `parse_resume({ userId, resumeId })` for fresh resume text.
3. Call `load_job_posting({ userId, jobPostingId })` for job cleanedText and title.
4. Call `tailor_bullets` with resumeText, jobText, jobTitle, missingSkills, recommendations.
5. Call `save_artifact` with type `tailored_bullets` and content `{ bullets: [...] }`.
6. Present a **before/after table** for each bullet with rationale.

## Quality

- Exactly 3–5 bullets
- No fabricated employers or metrics
- Rewrites must be copy-paste ready
