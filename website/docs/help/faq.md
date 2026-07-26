---
sidebar_position: 1
---

# FAQ

## General

### Is my resume data private?

Yes. Resumes and analyses are scoped to your authenticated user via Convex. Other users cannot access your data.

### What file formats are supported?

PDF and DOCX, max 10 MB. Prefer text-based PDFs over scanned images.

### Can I analyze jobs without a URL?

Yes. Paste the full job description on the Analyze page (recommended when boards block bots).

### Why is my match score lower than expected?

The agent weights must-have skills heavily and flags honest gaps. Check **Missing skills** and **Recommendations** on the report. Use **Learning plan** and **Tailor bullets** to improve.

### Which AI model is used?

OpenAI **GPT-4.1** via `@ai-sdk/openai` (`agent/lib/model.ts`). You need `OPENAI_API_KEY` locally and in production.

## History and Tracker

### I finished an analysis but History is empty

Save may have failed. Check for an error toast on Analyze and the agent progress panel. Fix env (`OPENAI_API_KEY`, Convex) and re-run. See [History vs Tracker](../concepts/history-vs-tracker).

### Tracker is empty but History has reports

Older analyses may predate auto-tracking. Open the report and use **Save to tracker**, or run a new analysis (Saved cards are created on save).

### Why does History say “Untitled role”?

The job text had no extractable title. Put the title on the first line when pasting. Details: [Role titles](../concepts/role-titles).

### Do I need to Save to tracker every time?

No. New successful analyses auto-create a **Saved** application. Manual save is for edge cases (e.g. card was removed).

## Technical

### Why doesn't URL fetch work for some job boards?

Some sites block bots, require login, or use heavy JavaScript. Paste the text manually as a fallback.

### Why is parsed text empty on resume preview?

Parsing runs on first analysis. Run any analysis once, then preview updates.

### What's the daily limit?

20 full analyses per user per day. Re-score counts toward this limit.

### Do career tools count toward the limit?

Full analyses and re-score yes. Tailor / cover letter / learning plan currently do not increment the counter.

### Analysis stream shows errors about auth / empty IDs

Agent tools use trusted Convex endpoints with explicit `userId` — not your browser JWT. Empty optional IDs (e.g. blank `previousAnalysisId`) are stripped before save. If save still fails, check Convex logs and tool validation errors.

## Docs

### Docs show 500 or blank page?

Run `npm run build:docs` and restart `npm run dev`. See [Troubleshooting](./troubleshooting).

### How do I edit documentation?

Edit files in `website/docs/`, then `npm run build:docs`. For live preview: `npm run dev:docs` on port 3001.
