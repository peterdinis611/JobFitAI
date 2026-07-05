---
sidebar_position: 2
---

# Analyze

Route: `/analyze`

Start a new resume vs. job match analysis.

## Before you start

You need an **active resume**. If none exists, you'll see a getting-started prompt linking to **Resumes**.

## Job input modes

### Paste text

Paste the full job description — requirements, responsibilities, nice-to-haves. Job title is auto-extracted from the first lines when possible.

### URL

Provide an **HTTPS** URL. The agent:

1. Fetches the page server-side
2. Strips HTML and sanitizes content
3. Persists cleaned text + title via `update_job_posting`

:::caution
Some job boards block scraping or require login. If fetch fails, paste the text manually.
:::

## Live agent stream

The right panel streams eve agent messages and tool calls in real time. Typical pipeline:

```mermaid
sequenceDiagram
  participant UI as Analyze page
  participant Agent as eve Agent
  participant Tools as Tools
  participant DB as Convex

  UI->>Agent: Run analyze-match skill
  Agent->>Tools: parse_resume
  Tools->>DB: Read CV from storage
  Agent->>Tools: fetch_job_posting (URL only)
  Agent->>Tools: score_match
  Agent->>Tools: save_analysis
  Tools->>DB: Insert analysis
  Agent->>UI: Summary + analysis ID
```

## Rate limit

Each user gets **20 analyses per day**. If exceeded, you'll see a toast and the run won't start.

[Matching scores explained →](../concepts/matching-scores)
