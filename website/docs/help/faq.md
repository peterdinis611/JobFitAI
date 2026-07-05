---
sidebar_position: 1
---

# FAQ

## General

### Is my resume data private?

Yes. Resumes and analyses are scoped to your authenticated user via Convex. Other users cannot access your data.

### What file formats are supported?

PDF and DOCX, max 10 MB.

### Can I analyze jobs without a URL?

Yes. Paste the full job description on the Analyze page.

### Why is my match score lower than expected?

The agent weights must-have skills heavily and flags honest gaps. Check **Missing skills** and **Recommendations** on the report. Use **Learning plan** and **Tailor bullets** to improve.

## Technical

### Why doesn't URL fetch work for some job boards?

Some sites block bots, require login, or use heavy JavaScript. Paste the text manually as a fallback.

### Why is parsed text empty on resume preview?

Parsing runs on first analysis. Run any analysis once, then preview updates.

### What's the daily limit?

20 full analyses per user per day. Re-score counts toward this limit.

### Do career tools count toward the limit?

Full analyses and re-score yes. Tailor/cover letter/learning plan currently do not increment the counter.

## Docs

### Docs show 500 or blank page?

Run `npm run build:docs` and restart `npm run dev`. See [Troubleshooting](./troubleshooting).

### How do I edit documentation?

Edit files in `website/docs/`, then `npm run build:docs`.
