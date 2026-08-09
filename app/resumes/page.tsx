"use client"

import { useMutation, useQuery } from "convex/react"
import { Check, FileText, FileUp, Star, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { ResumePreviewDialog } from "@/components/resumes/resume-preview-dialog"
import { Button } from "@/components/ui/button"
import { MetricStrip } from "@/components/ui/metric-strip"
import { PageHeader } from "@/components/ui/page-header"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { wordCount } from "@/lib/extract-job-title"
import { cn } from "@/lib/utils"

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export default function ResumesPage() {
  const { ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const generateUploadUrl = useMutation(api.resumes.generateUploadUrl)
  const createResume = useMutation(api.resumes.create)
  const setActive = useMutation(api.resumes.setActive)
  const removeResume = useMutation(api.resumes.remove)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const active = resumes?.find((r) => r.isActive)
  const count = resumes?.length ?? 0

  const upload = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error("File too large (max 10 MB)")
        return
      }

      setUploading(true)
      try {
        const uploadUrl = await generateUploadUrl({})
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        })
        if (!res.ok) throw new Error("Upload failed")
        const { storageId } = (await res.json()) as { storageId: Id<"_storage"> }

        await createResume({
          storageId,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        })
        toast.success("Resume uploaded")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [generateUploadUrl, createResume],
  )

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resumes"
        description="Upload versions — the active CV is used for new analyses."
        action={
          <Button disabled={uploading} onClick={() => inputRef.current?.click()}>
            <FileUp className="size-4" />
            {uploading ? "Uploading…" : "Upload CV"}
          </Button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
          e.target.value = ""
        }}
      />

      {count > 0 ? (
        <MetricStrip
          items={[
            { label: "Versions", value: String(count) },
            {
              label: "Active",
              value: active?.fileName ? truncate(active.fileName, 28) : "—",
              tone: "primary",
            },
          ]}
        />
      ) : null}

      <section className="mac-window overflow-hidden">
        <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
          <h2 className="text-[15px] font-semibold tracking-tight">Upload</h2>
          <p className="text-xs text-muted-foreground">PDF or DOCX · max 10 MB</p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) void upload(file)
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center transition-colors",
            dragOver && "bg-primary/5",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.p
                key="up"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Uploading…
              </motion.p>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-transform",
                    dragOver && "-translate-y-0.5",
                  )}
                >
                  <FileUp className="size-5 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  {dragOver ? "Drop to upload" : "Drag & drop or click to upload"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </section>

      {count === 0 ? (
        <DashboardGettingStarted hasResume={false} />
      ) : (
        <section className="mac-window overflow-hidden">
          <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3 sm:px-5">
            <h2 className="text-[15px] font-semibold tracking-tight">Your versions</h2>
            <p className="text-xs text-muted-foreground">{count} uploaded</p>
          </div>
          <ul className="divide-y divide-border">
            {resumes?.map((resume: Doc<"resumes">) => (
              <li
                key={resume._id}
                className={cn(
                  "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
                  resume.isActive && "bg-primary/5",
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[14px] font-semibold tracking-tight">
                        {resume.fileName}
                      </p>
                      {resume.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          <Star className="size-2.5 fill-current" />
                          Active
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      v{resume.version} ·{" "}
                      {new Date(resume.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {resume.parsedText?.trim()
                        ? ` · ${wordCount(resume.parsedText).toLocaleString()} words`
                        : " · Not parsed yet"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <ResumePreviewDialog resume={resume} />
                  {!resume.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void setActive({ resumeId: resume._id }).then(() =>
                          toast.success("Active resume updated"),
                        )
                      }
                    >
                      <Check className="size-3.5" />
                      Set active
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Delete “${resume.fileName}”? Existing analyses keep their scores but lose this file link.`,
                        )
                      ) {
                        return
                      }
                      void removeResume({ resumeId: resume._id })
                        .then(() => toast.success("Resume deleted"))
                        .catch((e) =>
                          toast.error(e instanceof Error ? e.message : "Failed to delete"),
                        )
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}
