# Skill: Generate Interview Prep

Use when the user wants **interview questions / prep** for an existing analysis.

## Steps

1. Load analysis context (job title, match %, matching/missing skills, IDs).
2. Call `parse_resume({ userId, resumeId })`.
3. Call `load_job_posting({ userId, jobPostingId })`.
4. Call `generate_interview_prep` with resume text, job text, and skill context.
5. Call `save_artifact` with type `interview_prep` and content `{ questions, opener? }`.
6. Summarize the top 3 questions the candidate should rehearse first.

## Quality

- 6–8 questions, mixed categories (behavioral / technical / role / culture)
- Tips must reference this resume — no fabricated experience
- Address missing skills as “how would you ramp” questions, not gotchas
