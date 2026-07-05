"use client"

import { useCallback, useRef, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { Check, FileUp, Star } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion/motion-primitives"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { ResumePreviewDialog } from "@/components/resumes/resume-preview-dialog"
import { UploadIllustration } from "@/components/illustrations/jobfit-illustrations"
import { wordCount } from "@/lib/extract-job-title"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"
import type { Doc, Id } from "@/convex/_generated/dataModel"

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export default function ResumesPage() {
  const { ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const generateUploadUrl = useMutation(api.resumes.generateUploadUrl)
  const createResume = useMutation(api.resumes.create)
  const setActive = useMutation(api.resumes.setActive)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="space-y-8">
      <PageHeader
        title="Your resumes"
        description="Upload PDF or DOCX files. The latest upload becomes your active resume."
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

      <FadeIn delay={0.05}>
        <motion.div
          animate={{
            scale: dragOver ? 1.01 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card
            className={cn(
              "border-2 border-dashed border-border/70 bg-card/60 backdrop-blur-sm transition-colors",
              dragOver && "border-primary bg-primary/5",
              uploading && "pointer-events-none opacity-60",
            )}
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
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UploadIllustration />
                    <p className="mt-2 text-sm font-medium text-muted-foreground">Uploading…</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      animate={{ y: dragOver ? -4 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <FileUp className="size-10 text-primary" />
                    </motion.div>
                    <p className="text-sm font-medium">Drag & drop PDF or DOCX here</p>
                    <p className="text-xs text-muted-foreground">Max 10 MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>

      {resumes?.length === 0 ? (
        <FadeIn delay={0.1}>
          <DashboardGettingStarted hasResume={false} />
        </FadeIn>
      ) : (
        <StaggerList className="grid gap-4 sm:grid-cols-2">
          {resumes?.map((resume: Doc<"resumes">) => (
            <StaggerItem key={resume._id}>
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Card
                  className={cn(
                    "border-border/60 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md",
                    resume.isActive && "border-primary/40 ring-1 ring-primary/20",
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{resume.fileName}</CardTitle>
                      {resume.isActive ? (
                        <Badge className="gap-1 bg-primary">
                          <Star className="size-3 fill-current" /> Active
                        </Badge>
                      ) : null}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <span>
                        v{resume.version} · {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                      {resume.parsedText?.trim() ? (
                        <Badge variant="secondary">
                          {wordCount(resume.parsedText).toLocaleString()} words
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not parsed yet</Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
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
                        <Check className="size-4" /> Set active
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Used for new analyses</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  )
}
