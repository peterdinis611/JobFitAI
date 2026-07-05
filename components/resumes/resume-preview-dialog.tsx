"use client"

import { FileText } from "lucide-react"
import type { Doc } from "@/convex/_generated/dataModel"
import { wordCount } from "@/lib/extract-job-title"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ResumePreviewDialog({ resume }: { resume: Doc<"resumes"> }) {
  const parsed = resume.parsedText?.trim()
  const count = parsed ? wordCount(parsed) : null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="size-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resume.fileName}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            <span>Version {resume.version}</span>
            {count !== null ? (
              <Badge variant="secondary">{count.toLocaleString()} words</Badge>
            ) : (
              <Badge variant="outline">Not parsed yet</Badge>
            )}
            {resume.isActive ? <Badge>Active</Badge> : null}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh] rounded-lg border bg-muted/30 p-4">
          {parsed ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {parsed}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Text extraction runs automatically on your first analysis. Upload complete — you can
              run a match from the Analyze page to parse this file.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
