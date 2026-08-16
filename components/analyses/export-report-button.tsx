"use client"

import { Check, Copy, Download, FileDown } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Doc } from "@/convex/_generated/dataModel"
import {
  analysisToMarkdown,
  downloadAnalysisDocx,
  downloadAnalysisMarkdown,
  downloadAnalysisPdf,
} from "@/lib/analysis-export"

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
  const payload = { analysis, resume, jobPosting }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(analysisToMarkdown(payload))
      setCopied(true)
      toast.success("Report copied as Markdown")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="size-3.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => void copyMarkdown()}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy Markdown"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            downloadAnalysisMarkdown(payload)
            toast.success("Downloaded Markdown")
          }}
        >
          <Download className="size-3.5" />
          Download .md
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void downloadAnalysisDocx(payload)
              .then(() => toast.success("Downloaded DOCX"))
              .catch((e) => toast.error(e instanceof Error ? e.message : "DOCX export failed"))
          }}
        >
          <Download className="size-3.5" />
          Download .docx
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            try {
              downloadAnalysisPdf(payload)
              toast.success("Downloaded PDF")
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "PDF export failed")
            }
          }}
        >
          <Download className="size-3.5" />
          Download .pdf
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
