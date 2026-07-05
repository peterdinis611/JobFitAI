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

- Parsed plain text (after first analysis parses the file)
- Word count badge
- Version and active status

:::info
Parsing runs during the first analysis via `parse_resume`. Until then, preview shows "Not parsed yet".
:::

## Versioning tips

- Upload a revised CV as a new version rather than overwriting
- Use **Re-score with new CV** on a report to link before/after match scores
