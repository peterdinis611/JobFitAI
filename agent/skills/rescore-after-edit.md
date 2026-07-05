# Skill: Re-score After Edit

Use when the user uploads a **new CV version** and wants to compare match % against a previous analysis.

## Steps

1. Confirm `previousAnalysisId`, `userId`, `resumeId` (new version), `jobPostingId` from context.
2. Call `parse_resume({ resumeId })` on the new CV.
3. Use existing job `cleanedText` from the job posting (no re-fetch unless URL source and text empty).
4. Call `score_match` with resume + job text.
5. Call `save_analysis` with all score fields **and** `previousAnalysisId` from context.
6. Report match % **delta** vs previous (e.g. "+8 points") and highlight what changed.

## Quality

- Always pass `previousAnalysisId` when re-scoring
- Note which resume version was used (fileName)
