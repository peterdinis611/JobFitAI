---
sidebar_position: 5
---

# Job metadata

How JobFit extracts **title, company, location, and salary** from a posting — and where those fields show up.

## Fields

Stored on `jobPostings` (`convex/schema.ts`):

| Field | Source |
|-------|--------|
| **title** | First-line / labeled heuristics, `<title>` / `og:title`, JSON-LD `JobPosting.title` |
| **company** | Labeled lines (`Company:`, `Firma:`), `Title at Acme`, JSON-LD `hiringOrganization`, hostname (skipping job boards) |
| **location** | Labeled lines, city + remote/hybrid hints, JSON-LD `jobLocation` / `TELECOMMUTE` |
| **salary** | Labeled lines (`Salary:`, `Plat:`), currency ranges, JSON-LD `baseSalary` |

All four are optional. Missing metadata does not block scoring.

## When it is filled

1. **Paste** — `jobPostings.create` runs `extractJobMetadata` on the cleaned text  
2. **URL** — `fetch_job_posting` reads JSON-LD + page text, then `update_job_posting` merges heuristics  
3. Agent-trusted updates never wipe a better existing value with a blank one  

Implementation: `lib/extract-job-metadata.ts` and `agent/lib/fetch-job.ts` (`extractJsonLdJobMeta`).

## Where you see it

- **History / Compare / report header** — subtitle under the role (`company · location · salary`)  
- **Tracker cards** — same subtitle when present  
- **Application pack** — company, location, and salary in the pack header  

## How to get better metadata

1. Put the **role title on line 1**  
2. Include labeled lines when you paste:

```
Senior Frontend Engineer
Company: Acme Labs
Location: Berlin · Remote
Salary: €90k – €110k
```

3. Prefer career pages that expose schema.org `JobPosting` JSON-LD  
4. Paste text when the board blocks URL fetch — heuristics still run on the paste  

Job-board hosts (`linkedin.com`, `indeed.com`, `glassdoor.com`) are not used as the company name.

## Related

- [Role titles](./role-titles)  
- [Analyze](../user-guide/analyze)  
- [Data model](../architecture/data-model#jobpostings)  
