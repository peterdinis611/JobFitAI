---
name: jobfit-eve-agent
description: >-
  Works on JobFit eve agent — tools, skills, analyze-match pipeline, streaming UI.
  Use when editing agent/, analyze flow, tool schemas, or parseAnalysisStream.
---

# JobFit eve Agent

## Before coding

1. Read eve docs: `node_modules/eve/docs/` or https://eve.dev/docs
2. Read skill playbook: `agent/skills/analyze-match.md`
3. `next.config.ts` uses `withEve` — do not remove.

## Analyze-match pipeline

```
parse_resume
  → load_job_posting (text) | fetch_job_posting → update_job_posting (url)
  → score_match
  → save_analysis
```

## Starting analysis from UI

Use `hooks/use-run-analysis.ts` (shared by Analyze page and History quick start):

1. Rate limit: `api.rateLimits.checkAndIncrement`
2. Create job: `api.jobPostings.create` — store text in Convex, **not** in chat body
3. Agent message: `formatAgentSkillMessage({ skill: "analyze-match", summary, context, steps })`
4. Context must include: `userId`, `resumeId`, `jobPostingId`, `jobSource`, `resumeFileName`, optional `jobTitle`/`jobUrl`

## Streaming / progress UI

- `parseAnalysisStream(agent.data.messages)` → steps, `analysisId`, errors
- Analyze page toasts on save success/failure — failed save does **not** appear in History
- Redirect to `/analyze` after starting from History quick start

## Agent tools location

```
agent/tools/          defineTool implementations
agent/skills/         Markdown playbooks for agent
agent/agent.ts        Agent definition
lib/agent-message.ts  formatAgentSkillMessage, compact context JSON
lib/analyze-stream.ts parseAnalysisStream
```

## Tool / save rules

- Omit optional fields (`previousAnalysisId`, `eveSessionId`) when empty — never send `""`
- Job text lives in Convex; agent loads via `load_job_posting`
- Agent-trusted queries use `*ForAgent` variants with explicit `userId`

## Checklist

- [ ] Tool args match `lib/schemas/tools.ts` / convex validators
- [ ] No full job posting embedded in user-visible agent message
- [ ] Vitest updated if stream parsing changes

## More detail

- [analyze-flow.md](references/analyze-flow.md)
