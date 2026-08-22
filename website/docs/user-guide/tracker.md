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
| **Rejected** | Closed / not moving forward |

## Drag and drop

Drag a card between columns to update status. Drop on the column body (or another card in that column). Status also updates via the dropdown on each card.

## Notes, remove, and follow-ups

- **Add notes** on any card (interview feedback, contacts, next steps). Saves on blur.
- **Remove** deletes the tracker card only — the History analysis remains.
- **Follow-up reminders** auto-schedule when you move to **Applied** (7 days) or **Interview** (3 days). Edit or clear the date on the card. Due/overdue items appear in a banner at the top of Tracker and in the **bell** in the app toolbar.
- Enable **browser alerts** from the bell to get a system notification when a follow-up is overdue. Snooze 1 day or mark done without leaving the current page.

## Card contents

Each card shows:

- Job title (with fallbacks if the posting had no title)  
- Match percentage  
- Status control  
- Optional notes  
- **View report** link  
- Remove from tracker
## Empty state

If no applications are tracked, the page links back to **History** or **Analyze**. Run an analysis first — Tracker fills on save.

## Tips

- Keep **Saved** for triage; move to **Applied** only after you submit  
- Drag strong History matches forward instead of re-analyzing  
- Use alongside [Compare](./compare) when choosing between two Saved roles  

[History vs Tracker →](../concepts/history-vs-tracker)
