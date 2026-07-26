---
sidebar_position: 2
---

# Your first analysis

End-to-end walkthrough from zero to a saved match report.

## 1. Create an account

Sign up with email and password. You stay signed in via Convex Auth.

## 2. Upload a resume

1. Go to **Resumes** in the nav  
2. Drag & drop a **PDF** or **DOCX** (max 10 MB), or click **Upload CV**  
3. The latest upload becomes your **active** resume automatically  

:::tip Preview
After the first analysis, open **Preview** on a resume card to see parsed text and word count.
:::

## 3. Run a match

1. Go to **Analyze**  
2. Confirm your active resume is shown in the setup panel  
3. Paste the job description in the editor (or switch to **URL** for an HTTPS careers link)  
4. Click **Run analysis**  

Watch the **progress panel** — steps typically go:

`parse_resume` → `score_match` → `save_analysis`

(URL runs also fetch and update the job posting.)

You'll get a toast when the analysis saves successfully.

## 4. Find it in History and Tracker

When save completes:

- **History** (`/`) — new card with match %, seniority, and skill chips  
- **Tracker** (`/tracker`) — same role appears under **Saved** automatically  

Open the report from History (**View**) or from the tracker card.

## 5. Read the report

On `/analyses/[id]` you'll see:

- Match % ring and progress bar  
- Skill radar chart (when categories are available)  
- Matching / missing skills  
- Red flags and recommendations  
- **Career tools** panel (tailor, cover letter, learning plan, re-score)  

## 6. Go further

| Goal | Where |
|------|-------|
| Tailor CV bullets | Report → **Career tools** → Tailor bullets |
| Draft cover letter | Report → **Cover letter** |
| Close skill gaps | Report → **Learning plan** |
| Move application stage | **Tracker** → drag card or change status |
| Compare two roles | History → select two → **Compare selected** |
| Re-score after CV edit | Report → **Re-score with new CV** |

## Tips for a good first run

- Paste the **full** job description (requirements + responsibilities), not just the title  
- Put the job title near the top of the paste so History shows a clear role name  
- Prefer PDF/DOCX with selectable text (scanned images parse poorly)  

[Recommended workflow →](./recommended-workflow) · [Role titles →](../concepts/role-titles)

## Example job text

If you don't have a posting handy, paste any role description with clear requirements (skills, years of experience, responsibilities). Vague postings yield less precise scores.
