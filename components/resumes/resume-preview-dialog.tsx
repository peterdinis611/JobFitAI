"use client"

import { useQuery } from "convex/react"
import { FileText } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { wordCount } from "@/lib/extract-job-title"
import { isPdfResume } from "@/lib/resume-file"

const ResumePdfViewer = dynamic(
  () => import("./resume-pdf-viewer").then((mod) => mod.ResumePdfViewer),
  {
    ssr: false,
    loading: () => <PreviewSkeleton label="Loading PDF engine…" />,
  },
)

export function ResumePreviewDialog({ resume }: { resume: Doc<"resumes"> }) {
  const [open, setOpen] = useState(false)
  const parsed = resume.parsedText?.trim()
  const count = parsed ? wordCount(parsed) : null
  const pdf = isPdfResume(resume)
  const fileUrl = useQuery(
    api.resumes.getFileUrl,
    open && pdf ? { storageId: resume.storageId } : "skip",
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="size-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col gap-4 overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="pr-8">{resume.fileName}</DialogTitle>
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

        {pdf && parsed ? (
          <Tabs defaultValue="file" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="self-start">
              <TabsTrigger value="file">Document</TabsTrigger>
              <TabsTrigger value="text">Extracted text</TabsTrigger>
            </TabsList>
            <TabsContent value="file" className="mt-3 min-h-0 flex-1">
              <PdfPane url={fileUrl} />
            </TabsContent>
            <TabsContent value="text" className="mt-3 min-h-0 flex-1">
              <ParsedTextPane text={parsed} />
            </TabsContent>
          </Tabs>
        ) : pdf ? (
          <PdfPane url={fileUrl} />
        ) : (
          <ParsedTextPane
            text={parsed}
            empty={
              parsed
                ? undefined
                : "Visual preview is available for PDFs. DOCX text appears after your first analysis parses the file."
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function PdfPane({ url }: { url: string | null | undefined }) {
  if (url === undefined) {
    return <PreviewSkeleton label="Fetching file…" />
  }
  if (!url) {
    return (
      <p className="rounded-lg border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        Could not load this file. Try uploading the resume again.
      </p>
    )
  }
  return (
    <div className="h-[min(68vh,640px)] overflow-hidden rounded-lg border bg-muted/20">
      <ResumePdfViewer src={url} />
    </div>
  )
}

function ParsedTextPane({ text, empty }: { text?: string; empty?: string }) {
  return (
    <ScrollArea className="h-[min(55vh,520px)] rounded-lg border bg-muted/30 p-4">
      {text ? (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {text}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">
          {empty ??
            "Text extraction runs automatically on your first analysis. Upload complete — you can run a match from the Analyze page to parse this file."}
        </p>
      )}
    </ScrollArea>
  )
}

function PreviewSkeleton({ label }: { label: string }) {
  return (
    <div className="flex h-[min(68vh,640px)] flex-col items-center justify-center gap-2 rounded-lg border bg-muted/20 text-sm text-muted-foreground">
      <span className="size-8 animate-pulse rounded-md bg-primary/20" />
      {label}
    </div>
  )
}
