---
sidebar_position: 3
---

# Resumes

Route: `/resumes`

Manage CV versions used for analyses.

## Upload

- **Formats:** PDF, DOCX
- **Max size:** 10 MB
- **Drag & drop** or click **Upload CV**

Each upload creates a new **version** (`v1`, `v2`, …). The newest upload is automatically **active**.

## Active resume

Only one resume is active at a time. New analyses always use the active CV.

To switch: click **Set active** on an older version.

## Preview

**Preview** opens a dialog with:

- **PDF** — embedded document viewer (`@embedpdf/react-pdf-viewer`) plus extracted text after the first analysis
- **DOCX** — extracted plain text (visual preview is PDF-only)
- Word count badge, version, and active status

:::info
Parsing runs during the first analysis via `parse_resume`. Until then, a PDF still previews as a document; DOCX shows “Not parsed yet”.
:::

## Versioning tips

- Upload a revised CV as a new version rather than overwriting  
- Use **Re-score with new CV** on a report to link before/after match scores  
- Keep one **active** resume for new analyses; switch active only when you want all new runs to use that version  

## Related

- [First analysis](../getting-started/first-analysis)  
- [Career tools — Re-score](./career-tools#re-score)  
