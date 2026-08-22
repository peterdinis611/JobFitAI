---
sidebar_position: 4
---

# Role titles

How JobFit names a role in History, Tracker, and Compare — and how to avoid “Untitled role”.

## Display priority

The UI resolves a label in this order (`lib/role-label.ts`):

1. **Job posting `title`** — extracted on create/fetch when possible  
2. **Hostname from URL** — e.g. `Role at company.com`  
3. **Snippet** from cleaned job text — first sensible short line  
4. **Matching skills** — e.g. `React · TypeScript role`  
5. **Untitled role** — last resort  

## Why you see “Untitled role”

Common causes:

- Pasted only requirements bullets with no title line  
- Job board markup where the title never made it into cleaned text  
- Very short or emoji-heavy first lines that fail extraction heuristics  

## How to get better names

1. Paste with the **role title on line 1** (e.g. `Senior Frontend Engineer`)  
2. Prefer pasting full postings over truncated snippets  
3. For URL mode, prefer careers pages that expose a clear `<title>` / heading  
4. After save, you can still identify the role from match %, date, and skills on the card  

## Seniority labels

Raw agent values are mapped for display:

| Agent value | UI label |
|-------------|----------|
| `match` | Right level |
| `under` | Below target |
| `over` | Above target |

These appear on History cards and reports — not as the raw enum.

## Company, location, salary

Those fields are stored separately and shown as a subtitle — they are not part of this title fallback chain. See [Job metadata](./job-metadata).

## Related

- [Dashboard](../user-guide/dashboard)  
- [Job metadata](./job-metadata)  
- [Matching scores](./matching-scores)  
- [Job title extraction](../architecture/data-model#jobpostings) (data model)  
