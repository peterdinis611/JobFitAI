"use client"

import { useMutation, useQuery } from "convex/react"
import { Check, FileText, FileUp, Star, Trash2 } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { ResumePreviewDialog } from "@/components/resumes/resume-preview-dialog"
import { type ResumeUploadPhase, ResumeUploadZone } from "@/components/resumes/resume-upload-zone"
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
  const [phase, setPhase] = useState<ResumeUploadPhase>("idle")
  const [uploadName, setUploadName] = useState<string>()
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const uploading = phase === "transfer" || phase === "save"

  const active = resumes?.find((r) => r.isActive)
  const count = resumes?.length ?? 0

  const upload = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error("File too large (max 10 MB)")
        return
      }

      setUploadName(file.name)
      setProgress(0)
      setPhase("transfer")
      try {
        const uploadUrl = await generateUploadUrl({})
        const storageId = await postResumeFile(uploadUrl, file, setProgress)
        setPhase("save")
        setProgress(1)

        await createResume({
          storageId,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        })
        toast.success("Resume uploaded")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed")
      } finally {
        setPhase("idle")
        setUploadName(undefined)
        setProgress(0)
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
        <ResumeUploadZone
          phase={phase}
          fileName={uploadName}
          progress={progress}
          onPick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            if (phase === "idle") setPhase("hot")
          }}
          onDragLeave={(e) => {
            const next = e.relatedTarget
            if (next instanceof Node && e.currentTarget.contains(next)) return
            if (phase === "hot") setPhase("idle")
          }}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) void upload(file)
          }}
        />
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

function postResumeFile(
  url: string,
  file: File,
  onProgress: (ratio: number) => void,
): Promise<Id<"_storage">> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    xhr.responseType = "json"
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(event.loaded / event.total)
      }
    }
    xhr.onload = () => {
      try {
        const raw = xhr.response ?? xhr.responseText
        const body =
          typeof raw === "string" ? (JSON.parse(raw) as { storageId?: Id<"_storage"> }) : raw
        if (xhr.status >= 200 && xhr.status < 300 && body?.storageId) {
          resolve(body.storageId)
          return
        }
      } catch {
        /* fall through */
      }
      reject(new Error("Upload failed"))
    }
    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(file)
  })
}
