# Skill: Extract Job Requirements

Use when job posting text is unstructured (scraped HTML, LinkedIn paste, bullet-heavy description).

## Output structure (internal)

Extract and organize:

### Role metadata
- Title
- Seniority level (junior / mid / senior / staff / principal)
- Employment type if stated
- Location / remote policy

### Requirements
| Type | Items |
|------|-------|
| Must-have technical | e.g. TypeScript, React, 5+ years |
| Nice-to-have | e.g. GraphQL, AWS |
| Soft skills | communication, leadership |
| Domain | fintech, healthcare, etc. |

### Signals
- Years of experience required
- Education requirements
- Certifications
- Red-flag language ("rockstar", "wear many hats" without clarity)

## Parsing rules
1. **Must-have** — words like "required", "must", "minimum", mandatory bullet sections.
2. **Nice-to-have** — "preferred", "bonus", "plus".
3. Normalize skill names (e.g. "TS" → "TypeScript", "K8s" → "Kubernetes").
4. Ignore boilerplate EEO/legal/footer text.
5. If URL fetch was used, prefer `cleanedText` from `fetch_job_posting`.

## Handoff
Pass structured requirements mentally into `score_match` — ensure `jobText` passed to scoring includes the full cleaned posting.
