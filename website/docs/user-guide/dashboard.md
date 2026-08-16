---
sidebar_position: 1
---

# Dashboard (History)

Route: `/`

History is every match you've saved — filterable, sortable, and ready to compare.

:::info History ≠ Tracker
History lists **analyses** (reports). The **Tracker** lists **applications** (pipeline stages). Saving an analysis fills both. See [History vs Tracker](../concepts/history-vs-tracker).
:::

## Stat strip + insights

| Metric | Meaning |
|--------|---------|
| **Analyses** | Count of reports in the current list |
| **Average** | Mean match % |
| **Best** | Highest match % |

Below that, **Insights** shows:

- **Match trend** — recent scores over time (+/− pts from first → last in the window)
- **Top missing skills** — skills that recur across reports (how often they appear as gaps)

## Filters and sort

Quick filters by minimum match: **All**, **≥ 50%**, **≥ 70%**, **≥ 85%**.

Toggle **Match high → low** (or reverse) to reorder the list.

## Analysis cards

Each saved analysis appears as a card (not a dense table row):

| Element | Description |
|---------|-------------|
| ☐ | Select for comparison (pick two) |
| **Role** | Best available title — see [Role titles](../concepts/role-titles) |
| **Match** | Percentage with progress bar and color tone |
| **Seniority** | Human label: Right level / Below target / Above target |
| **Skills** | Chips for top matching skills |
| **Date** | When the analysis was saved |
| **View** | Open full report |

## Compare analyses

1. Check two cards  
2. Click **Compare selected** in the header  
3. Side-by-side scores and skills on `/compare`  

## Archive and delete

Use the ⋯ menu on each card:

- **Archive** — hides from the default History list (toggle **Show archived** to restore)  
- **Delete permanently** — removes the analysis, related tracker card, and career-tool artifacts  

## Empty and filtered states

| State | What you see |
|-------|----------------|
| No analyses yet | Getting started guide: upload CV → add job → run analysis |
| Filter matches nothing | Prompt to clear filters |
| No active resume | Nudge to upload on Resumes |

## Tips

- Prefer filters over scrolling when you have many reports  
- Strong fits (≥ 85%) are good candidates to move forward in Tracker  
- If a card says **Untitled role**, the posting likely lacked a clear title — open the report and check the job text  

[Compare page →](./compare) · [Analyze →](./analyze)
