---
sidebar_position: 4
---

# Analysis report

Route: `/analyses/[id]`

The full match report for a single resume + job pairing.

## Header

- **Job title** (from posting or [role-label fallbacks](../concepts/role-titles))
- **Company · location · salary** when extracted ([job metadata](../concepts/job-metadata))
- **Resume filename** and analysis date
- **Export** — copy or download the match report as Markdown / DOCX / PDF
- **Match score ring** and seniority badge (Right level / Below target / Above target)

## Re-score delta

If this analysis was created via **Re-score with new CV**, a banner shows:

```
Re-scored vs previous: 72% → 80% (+8 pts)
```

With a link to the previous report.

## Sections

| Section | Content |
|---------|---------|
| **Skill categories** | Radar chart (technical, soft, domain, etc.) |
| **Matching skills** | Skills present in both CV and job |
| **Missing skills** | Gaps to address |
| **Red flags** | Concerns (gaps, seniority mismatch, etc.) |
| **Recommendations** | Actionable CV improvements |

## Career tools

Below the report, the **Career tools** panel provides:

- [Tailor bullets](./career-tools#tailor-bullets)
- [Full tailored CV](./career-tools#full-tailored-cv)
- [Application pack](./career-tools#application-pack)
- [Cover letter](./career-tools#cover-letter)
- [Learning plan](./career-tools#learning-plan)
- [Interview prep](./career-tools#interview-prep)
- [Re-score](./career-tools#re-score)
- [Save to tracker](./career-tools#save-to-tracker)

Generated content appears in tabs; the **Agent** tab shows the live stream.

## Export format

Copy / download on the report produces Markdown (or DOCX / PDF) with role, score, skills, flags, and recommendations — ready for Notion, email, or version control.

To include a tailored CV, bullets, and cover letter in one file, use **Pack .md / .docx / .pdf** after those career tools have run. See [Application pack](./career-tools#application-pack).
