# Skill: Skill Gap Learning Plan

Use when the user wants a **learning plan** to close missing skills from an analysis.

## Steps

1. Load `missingSkills` from analysis context (required).
2. Call `generate_learning_plan` with missingSkills, jobTitle, seniorityFit.
3. Call `save_artifact` with type `learning_plan` and content `{ plans: [...] }`.
4. Format output per skill: "To close **{skill}** gap: {durationWeeks}-week plan" with numbered steps.

## Quality

- Default 2 weeks per skill unless complexity warrants more
- Actionable steps only — docs, projects, exercises
- Prioritize top 3–5 gaps from the analysis
