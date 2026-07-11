# Skill: Analyze Match

Use this playbook when the user requests a **full resume vs. job posting analysis**.

## Steps

### 1. Gather inputs
- Confirm `resumeId`, `userId`, and `jobPostingId` from session context.
- Determine job content:
  - **URL** → `fetch_job_posting` then `update_job_posting` with the returned title and cleanedText
  - **Pasted text** → call `load_job_posting({ userId, jobPostingId })` to read cleanedText from Convex (do not expect full job text in the chat message)

### 2. Parse resume
- Call `parse_resume({ userId, resumeId })`.
- If parsing fails, stop and explain the document issue.

### 3. Extract job requirements (if unstructured)
- Load `extract-job-requirements` when job text is long or messy.
- Build a mental checklist: must-have skills, nice-to-haves, years of experience, seniority, domain.

### 4. Score
- Call `score_match` with `resumeText`, `jobText`, optional `jobTitle`.
- Review output for plausibility; if match % seems off vs. obvious gaps, note uncertainty in narrative.

### 5. Persist
- Call `save_analysis` with all score fields + context IDs + `eveSessionId` if available.
- **Do not** pass `previousAnalysisId` unless this is an explicit re-score flow.

### 6. Report
- Summarize for the user using the format in `instructions.md`.
- Link to the saved analysis ID when returned.

## Quality checks
- At least 3 matching and 3 missing skills when the job lists requirements.
- Recommendations must be **actionable** (not "learn more").
- Red flags must cite evidence from resume or posting.
