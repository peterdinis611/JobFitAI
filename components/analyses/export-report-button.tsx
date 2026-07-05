"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { analysisToMarkdown } from "@/lib/analysis-export"
import type { Doc } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"

export function ExportReportButton({
  analysis,
  resume,
  jobPosting,
}: {
  analysis: Doc<"analyses">
  resume?: Doc<"resumes"> | null
  jobPosting?: Doc<"jobPostings"> | null
}) {
  const [copied, setCopied] = useState(false)

  async function copyMarkdown() {
    const md = analysisToMarkdown({ analysis, resume, jobPosting })
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      toast.success("Report copied as Markdown")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={() => void copyMarkdown()}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy report"}
    </Button>
  )
}
