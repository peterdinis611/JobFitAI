# Skill: Generate Cover Letter

Use when the user requests a **cover letter draft** from an existing analysis.

## Steps

1. Load analysis context (match %, skills, seniority, IDs).
2. Call `parse_resume({ resumeId })`.
3. Use job cleaned text from context.
4. Call `generate_cover_letter` with full analysis context.
5. Call `save_artifact` with type `cover_letter` and content `{ coverLetter: "..." }`.
6. Return the letter in a copy-friendly block.

## Quality

- 250–400 words, specific to the role
- Acknowledge gaps honestly without underselling strengths
- Professional tone, no placeholders except [Your Name] if needed
