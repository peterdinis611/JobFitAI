# Analyze flow reference

## Frontend entry points

| Surface | File |
|---------|------|
| Full setup | `app/analyze/page.tsx` + `AnalyzeSetupPanel` |
| History quick start | `components/dashboard/history-quick-start.tsx` |

## Progress panel

`components/analyze/analyze-progress-panel.tsx` reads `parseAnalysisStream` step statuses.

## Other agent skills

```
agent/skills/tailor-cv.md
agent/skills/generate-tailored-cv.md
agent/skills/rescore-after-edit.md
agent/skills/generate-learning-plan.md
```

Career tools on analysis detail use separate tool invocations — do not mix into analyze-match unless requested.

## Evals

Agent eval assets under `evals/` — run via project test scripts when touching scoring prompts.
