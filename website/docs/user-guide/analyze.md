---
sidebar_position: 2
---

# Analyze

Route: `/analyze`

Start a new resume vs. job match analysis.

## Layout

| Panel | Purpose |
|-------|---------|
| **Setup** (left) | Active resume, job editor / URL, Run analysis |
| **Progress** (right) | Step pipeline + compact agent status while running |

When idle, the progress panel explains what will happen. During a run it tracks parse → score → save (and fetch for URLs).

## Before you start

You need an **active resume**. If none exists, you'll see a prompt linking to **Resumes**.

## Job input modes

### Paste text (recommended)

Paste the full job description — put the **role title on line 1**. JobFit auto-detects the title (editable before you run). Prefer paste when boards require login or block bots.

### URL

HTTPS careers links (http is upgraded). If fetch fails, Analyze shows a **Switch to paste** prompt — scoring is the same either way.

You can always set or override the **Role title** field before running.

### Batch

Switch **Batch** on Setup to queue several jobs:

- **Paste:** separate postings with a `---` line
- **URL:** one HTTPS link per line

Each queued job runs one after another (the agent is single-session) and counts toward the daily analysis limit. Company, location, and salary are extracted when the posting includes them.

## What happens on Run

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
  Tools->>DB: Insert analysis + Saved application
  Agent->>UI: Summary + analysis ID
```

On successful save:

1. Toast confirms the analysis was stored  
2. The report appears under **History**  
3. An application card is created under **Tracker → Saved**  

## Rate limit

Each user gets **20 analyses per day**. If exceeded, you'll see a toast and the run won't start.

[Matching scores →](../concepts/matching-scores) · [Troubleshooting →](../help/troubleshooting)
