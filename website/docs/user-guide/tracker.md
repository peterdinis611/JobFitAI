---
sidebar_position: 5
---

# Application tracker

Route: `/tracker`

Kanban board for tracking job applications linked to match analyses.

:::info Auto-track
Every successful analysis save creates a **Saved** card automatically. You don't need a separate “Save to tracker” step for new analyses (manual save still works if a card was removed).
:::

## Columns

| Status | Typical use |
|--------|----------------|
| **Saved** | Roles you're considering |
| **Applied** | Application submitted |
| **Interview** | In interview process |
| **Offer** | Offer received (or negotiating) |

## Drag and drop

Drag a card between columns to update status. Drop on the column body (or another card in that column). Status also updates via the dropdown on each card.

## Card contents

Each card shows:

- Job title (with fallbacks if the posting had no title)  
- Match percentage  
- Status control  
- **View report** link  

## Empty state

If no applications are tracked, the page links back to **History** or **Analyze**. Run an analysis first — Tracker fills on save.

## Tips

- Keep **Saved** for triage; move to **Applied** only after you submit  
- Drag strong History matches forward instead of re-analyzing  
- Use alongside [Compare](./compare) when choosing between two Saved roles  

[History vs Tracker →](../concepts/history-vs-tracker)
