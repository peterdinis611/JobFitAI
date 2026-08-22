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

## Notes and remove

- **Add notes** on any card (interview feedback, contacts, next steps). Saves on blur.
- **Remove** deletes the tracker card only — the History analysis remains.

## Follow-up notifications

Reminders close the loop after you apply:

| Trigger | Default date |
|---------|--------------|
| Move to **Applied** | +7 days (if no date is set yet) |
| Move to **Interview** | +3 days (if no date is set yet) |
| Move to **Offer** or **Rejected** | Date is cleared |

You can edit or clear the date on the card.

Due items (within 7 days) show in:

1. **Banner** at the top of Tracker  
2. **Bell** in the app toolbar (any page) — overdue and due-today count as the badge  

From the bell:

- Open Tracker  
- **Snooze 1d** — push the date 24 hours  
- **Done** — clear the reminder  
- **Enable browser alerts** — system notification once per overdue card per UTC day (browser permission required)

Implementation: `applications.followUpAt`, `listDueFollowUps`, `setFollowUp`.

## Card contents

Each card shows:

- Job title (with fallbacks if the posting had no title)  
- Company / location / salary when extracted ([job metadata](../concepts/job-metadata))  
- Match percentage  
- Status control  
- Optional notes  
- Follow-up date (when set)  
- **View report** link  
- Remove from tracker

## Empty state

If no applications are tracked, the page links back to **History** or **Analyze**. Run an analysis first — Tracker fills on save.

## Tips

- Keep **Saved** for triage; move to **Applied** only after you submit  
- Drag strong History matches forward instead of re-analyzing  
- Use alongside [Compare](./compare) when choosing between two Saved roles  

[History vs Tracker →](../concepts/history-vs-tracker)
