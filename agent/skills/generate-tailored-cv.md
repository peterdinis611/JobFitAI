# Skill: Generate Tailored CV

Use when the user wants a **full resume draft** for a specific job analysis — not just 3–5 bullets.

## Steps

1. Load context: `analysisId`, `userId`, `resumeId`, `jobPostingId`, match fields, optional company.
2. Call `parse_resume({ userId, resumeId })` for fresh resume text.
3. Call `load_job_posting({ userId, jobPostingId })` for cleanedText, title, company.
4. Call `generate_tailored_cv` with resumeText, jobText, jobTitle, company, matchingSkills, missingSkills, recommendations.
5. Call `save_artifact` with type `tailored_cv` and content `{ headline, summary, experience, skills }`.
6. Present the draft as copy-ready sections. Remind the user to verify employers, dates, and metrics.

## Quality

- Do not invent employers, dates, degrees, or metrics
- Experience headings must correspond to real resume roles
- Skills must appear on the resume or be honest paraphrases
- This complements `tailor-cv` (bullets only) — do not skip `save_artifact`
