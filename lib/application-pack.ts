import { Document, type FileChild, HeadingLevel, Packer, Paragraph, TextRun } from "docx"
import { jsPDF } from "jspdf"
import type { Doc } from "@/convex/_generated/dataModel"
import { analysisToMarkdown } from "@/lib/analysis-export"
import { downloadTextFile, slugifyRole, tailoredBulletsToMarkdown } from "@/lib/tailored-export"

export type TailoredCvDraft = {
  headline: string
  summary: string
  experience: { heading: string; bullets: string[] }[]
  skills: string[]
}

export type ApplicationPackInput = {
  analysis: Doc<"analyses">
  resume?: Doc<"resumes"> | null
  jobPosting?: Doc<"jobPostings"> | null
  tailoredCv?: TailoredCvDraft | null
  bullets?: { original: string; rewritten: string; rationale?: string }[] | null
  coverLetter?: string | null
}

export function tailoredCvToMarkdown(cv: TailoredCvDraft, jobTitle?: string): string {
  const lines = [
    `# ${cv.headline}`,
    ``,
    jobTitle ? `**Target role:** ${jobTitle}` : "",
    ``,
    `## Summary`,
    ``,
    cv.summary,
    ``,
  ].filter((line, i, arr) => line !== "" || arr[i - 1] !== "")

  for (const section of cv.experience) {
    lines.push(`## ${section.heading}`, ``, ...section.bullets.map((b) => `- ${b}`), ``)
  }

  if (cv.skills.length > 0) {
    lines.push(`## Skills`, ``, cv.skills.join(" · "), ``)
  }

  lines.push(`---`, `*Tailored draft — verify employers, dates, and metrics before sending.*`)
  return lines.join("\n")
}

export function applicationPackMarkdown(data: ApplicationPackInput): string {
  const role = data.jobPosting?.title?.trim() || "Target role"
  const company = data.jobPosting?.company?.trim()
  const parts = [
    `# JobFit AI — Application pack`,
    ``,
    `**Role:** ${role}${company ? ` · ${company}` : ""}`,
    data.jobPosting?.location ? `**Location:** ${data.jobPosting.location}` : "",
    data.jobPosting?.salary ? `**Salary:** ${data.jobPosting.salary}` : "",
    `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
    ``,
    `Verify every claim against your real experience before applying.`,
    ``,
    `---`,
    ``,
    analysisToMarkdown({
      analysis: data.analysis,
      resume: data.resume,
      jobPosting: data.jobPosting,
    }),
  ]

  if (data.tailoredCv) {
    parts.push(``, `---`, ``, tailoredCvToMarkdown(data.tailoredCv, role))
  }

  if (data.bullets?.length) {
    parts.push(``, `---`, ``, tailoredBulletsToMarkdown(data.bullets, { jobTitle: role }))
  }

  if (data.coverLetter?.trim()) {
    parts.push(``, `---`, ``, `# Cover letter`, ``, data.coverLetter.trim())
  }

  return parts.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n")
}

export function downloadApplicationPackMarkdown(data: ApplicationPackInput) {
  const slug = slugifyRole(data.jobPosting?.title) || "role"
  downloadTextFile(`jobfit-pack-${slug}.md`, applicationPackMarkdown(data))
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadApplicationPackDocx(data: ApplicationPackInput): Promise<void> {
  const role = data.jobPosting?.title?.trim() || "Target role"
  const children: FileChild[] = [
    new Paragraph({ text: "JobFit AI — Application pack", heading: HeadingLevel.HEADING_1 }),
    new Paragraph({
      children: [
        new TextRun({ text: "Role: ", bold: true }),
        new TextRun(role),
        data.jobPosting?.company ? new TextRun(`  ·  ${data.jobPosting.company}`) : new TextRun(""),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Verify every claim against your real experience before applying.",
          italics: true,
          size: 20,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "Match report", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({
      children: [
        new TextRun({ text: "Score: ", bold: true }),
        new TextRun(`${data.analysis.matchPercentage}%`),
      ],
    }),
    ...data.analysis.matchingSkills.map((s) => new Paragraph({ text: `• ${s}` })),
  ]

  if (data.tailoredCv) {
    children.push(
      new Paragraph({ text: "" }),
      new Paragraph({ text: data.tailoredCv.headline, heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.tailoredCv.summary }),
    )
    for (const section of data.tailoredCv.experience) {
      children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_3 }))
      for (const bullet of section.bullets) {
        children.push(new Paragraph({ text: `• ${bullet}` }))
      }
    }
    if (data.tailoredCv.skills.length > 0) {
      children.push(
        new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: data.tailoredCv.skills.join(" · ") }),
      )
    }
  }

  if (data.bullets?.length) {
    children.push(
      new Paragraph({ text: "" }),
      new Paragraph({ text: "Tailored bullets", heading: HeadingLevel.HEADING_2 }),
    )
    for (const bullet of data.bullets) {
      children.push(new Paragraph({ text: `• ${bullet.rewritten}` }))
    }
  }

  if (data.coverLetter?.trim()) {
    children.push(
      new Paragraph({ text: "" }),
      new Paragraph({ text: "Cover letter", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.coverLetter.trim() }),
    )
  }

  children.push(
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Generated by JobFit AI", italics: true, size: 18 })],
    }),
  )

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  downloadBlob(`jobfit-pack-${slugifyRole(role) || "role"}.docx`, blob)
}

export function downloadApplicationPackPdf(data: ApplicationPackInput) {
  const role = data.jobPosting?.title?.trim() || "Target role"
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 48
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2
  let y = margin

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  const write = (
    text: string,
    opts?: { bold?: boolean; size?: number; color?: [number, number, number] },
  ) => {
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal")
    doc.setFontSize(opts?.size ?? 11)
    if (opts?.color) doc.setTextColor(...opts.color)
    else doc.setTextColor(30, 30, 30)
    const lines = doc.splitTextToSize(text, maxWidth) as string[]
    ensureSpace(lines.length * ((opts?.size ?? 11) + 4) + 4)
    doc.text(lines, margin, y)
    y += lines.length * ((opts?.size ?? 11) + 4) + 6
  }

  write("JobFit AI — Application pack", { bold: true, size: 18 })
  write(`Role: ${role}${data.jobPosting?.company ? ` · ${data.jobPosting.company}` : ""}`, {
    size: 12,
  })
  write("Verify every claim before sending.", { size: 10, color: [100, 100, 100] })
  y += 6
  write(`Match score: ${data.analysis.matchPercentage}%`, { bold: true, size: 13 })

  if (data.tailoredCv) {
    write(data.tailoredCv.headline, { bold: true, size: 14 })
    write(data.tailoredCv.summary)
    for (const section of data.tailoredCv.experience) {
      write(section.heading, { bold: true, size: 12 })
      for (const bullet of section.bullets) write(`• ${bullet}`)
    }
    if (data.tailoredCv.skills.length) write(data.tailoredCv.skills.join(" · "), { size: 10 })
  }

  if (data.coverLetter?.trim()) {
    y += 6
    write("Cover letter", { bold: true, size: 13 })
    write(data.coverLetter.trim())
  }

  write("Generated by JobFit AI", { size: 9, color: [140, 140, 140] })
  doc.save(`jobfit-pack-${slugifyRole(role) || "role"}.pdf`)
}
