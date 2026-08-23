"use client"

import type { CSSProperties, DragEvent } from "react"
import { cn } from "@/lib/utils"

export type ResumeUploadPhase = "idle" | "hot" | "transfer" | "save"

type ResumeUploadZoneProps = {
  phase: ResumeUploadPhase
  fileName?: string
  progress: number
  onPick: () => void
  onDragEnter: (event: DragEvent<HTMLButtonElement>) => void
  onDragOver: (event: DragEvent<HTMLButtonElement>) => void
  onDragLeave: (event: DragEvent<HTMLButtonElement>) => void
  onDrop: (event: DragEvent<HTMLButtonElement>) => void
}

const PHASE_COPY: Record<ResumeUploadPhase, { kicker: string; title: string }> = {
  idle: { kicker: "Ready", title: "Drag & drop or click to upload" },
  hot: { kicker: "Release", title: "Drop to ingest this CV" },
  transfer: { kicker: "Ingest", title: "Scanning the page into storage" },
  save: { kicker: "File", title: "Registering this version" },
}

export function ResumeUploadZone({
  phase,
  fileName,
  progress,
  onPick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
}: ResumeUploadZoneProps) {
  const busy = phase === "transfer" || phase === "save"
  const copy = PHASE_COPY[phase]
  const clamped = Math.min(1, Math.max(0, progress))
  const percent = phase === "save" ? 100 : Math.round(clamped * 100)

  return (
    <button
      type="button"
      disabled={busy}
      aria-busy={busy}
      aria-live="polite"
      onClick={onPick}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="cv-ingest-hit"
    >
      <span
        className={cn("cv-ingest", `cv-ingest--${phase}`)}
        style={{ "--cv-progress": String(clamped) } as CSSProperties}
      >
        <span className="cv-ingest-stage" aria-hidden>
          <span className="cv-ingest-dust" />
          <span className="cv-ingest-dust cv-ingest-dust--b" />
          <span className="cv-ingest-sheet">
            <span className="cv-ingest-fold" />
            <span className="cv-ingest-line" />
            <span className="cv-ingest-line" />
            <span className="cv-ingest-line" />
            <span className="cv-ingest-line" />
            <span className="cv-ingest-beam" />
          </span>
          <span className="cv-ingest-slot">
            <span className="cv-ingest-slot-lip" />
            <span className="cv-ingest-slot-glow" />
          </span>
        </span>

        <span className="cv-ingest-copy">
          <span className="cv-ingest-kicker">{copy.kicker}</span>
          <span className="cv-ingest-title">{copy.title}</span>
          {fileName ? <span className="cv-ingest-file">{fileName}</span> : null}
        </span>

        {busy ? (
          <span className="cv-ingest-meter">
            <span className="cv-ingest-meter-track">
              <span className="cv-ingest-meter-fill" />
            </span>
            <span className="cv-ingest-meter-pct">{percent}%</span>
          </span>
        ) : (
          <span className="cv-ingest-hint">PDF or DOCX · max 10 MB</span>
        )}
      </span>
    </button>
  )
}
