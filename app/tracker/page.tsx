"use client"

import { useMutation, useQuery } from "convex/react"
import {
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  GripVertical,
  Kanban,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { type DragEvent, useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { roleTitle } from "@/lib/role-label"
import { cn } from "@/lib/utils"

type Status = "saved" | "applied" | "interview" | "offer"

const columns: {
  id: Status
  label: string
  hint: string
  accent: string
  header: string
}[] = [
  {
    id: "saved",
    label: "Saved",
    hint: "Interested",
    accent: "bg-muted-foreground",
    header: "text-muted-foreground",
  },
  {
    id: "applied",
    label: "Applied",
    hint: "Sent",
    accent: "bg-primary",
    header: "text-primary",
  },
  {
    id: "interview",
    label: "Interview",
    hint: "In process",
    accent: "bg-warning",
    header: "text-warning",
  },
  {
    id: "offer",
    label: "Offer",
    hint: "Won",
    accent: "bg-success",
    header: "text-success",
  },
]

const STATUS_IDS = new Set<Status>(columns.map((c) => c.id))

type Row = {
  application: Doc<"applications">
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

const DRAG_MIME = "application/x-jobfit-application"

function matchTone(pct: number) {
  if (pct >= 85) return "bg-success/15 text-success"
  if (pct >= 70) return "bg-primary/15 text-primary"
  if (pct >= 50) return "bg-warning/15 text-warning"
  return "bg-destructive/15 text-destructive"
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(ts))
}

function TrackerCard({
  row,
  onMove,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  row: Row
  onMove: (id: Id<"applications">, status: Status) => void
  isDragging: boolean
  onDragStart: (id: Id<"applications">, status: Status) => void
  onDragEnd: () => void
}) {
  const { application, analysis, resume, jobPosting } = row
  const title = roleTitle(jobPosting, analysis)

  function handleDragStart(e: DragEvent<HTMLElement>) {
    e.dataTransfer.setData(DRAG_MIME, application._id)
    e.dataTransfer.setData("text/plain", application._id)
    e.dataTransfer.effectAllowed = "move"
    onDragStart(application._id, application.status)
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group cursor-grab rounded-xl border border-border bg-card p-3.5 shadow-sm active:cursor-grabbing",
        "transition-[box-shadow,opacity,transform] hover:shadow-md",
        isDragging && "scale-[0.98] opacity-45 ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-start gap-2">
        <div
          className="mt-1 flex shrink-0 touch-none text-muted-foreground/50 group-hover:text-muted-foreground"
          aria-hidden
        >
          <GripVertical className="size-4" />
        </div>
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Briefcase className="size-3.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight">
            {title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-1.5 py-0.5 font-medium tabular-nums",
                matchTone(analysis.matchPercentage),
              )}
            >
              {analysis.matchPercentage}% match
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3 opacity-70" />
              {formatDate(application.updatedAt ?? application.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {resume?.fileName ? (
        <p className="mt-2.5 flex items-center gap-1.5 truncate pl-6 text-[11px] text-muted-foreground">
          <FileText className="size-3 shrink-0 opacity-70" />
          <span className="truncate">{resume.fileName}</span>
        </p>
      ) : null}

      <div
        className="mt-3 space-y-2 border-t border-border/70 pt-3"
        onPointerDown={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
      >
        <Select
          value={application.status}
          onValueChange={(v) => void onMove(application._id, v as Status)}
        >
          <SelectTrigger className="h-8 w-full text-[12px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-between px-2.5 text-[12px] text-muted-foreground hover:text-foreground"
        >
          <Link href={`/analyses/${analysis._id}`} draggable={false}>
            View report
            <ChevronRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

function DropColumn({
  column,
  items,
  isOver,
  isDragging,
  onMove,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDrop,
  draggingId,
}: {
  column: (typeof columns)[number]
  items: Row[]
  isOver: boolean
  isDragging: boolean
  onMove: (id: Id<"applications">, status: Status) => void
  onDragStart: (id: Id<"applications">, status: Status) => void
  onDragEnd: () => void
  onDragEnter: (status: Status) => void
  onDragLeave: (status: Status) => void
  onDrop: (status: Status, e: DragEvent) => void
  draggingId: Id<"applications"> | null
}) {
  return (
    <section
      className={cn(
        "flex min-h-[280px] flex-col rounded-2xl border bg-muted/20 transition-[border-color,background-color,box-shadow]",
        isOver && isDragging
          ? "border-primary bg-primary/8 shadow-[inset_0_0_0_1px] shadow-primary/30"
          : "border-border",
      )}
      onDragEnter={(e) => {
        e.preventDefault()
        onDragEnter(column.id)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        onDragEnter(column.id)
      }}
      onDragLeave={(e) => {
        const related = e.relatedTarget as Node | null
        if (related && e.currentTarget.contains(related)) return
        onDragLeave(column.id)
      }}
      onDrop={(e) => onDrop(column.id, e)}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border/70 px-3.5 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 shrink-0 rounded-full", column.accent)} />
            <h2 className={cn("text-[13px] font-semibold", column.header)}>{column.label}</h2>
          </div>
          <p className="mt-0.5 pl-4 text-[11px] text-muted-foreground">{column.hint}</p>
        </div>
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-[11px] font-medium tabular-nums text-muted-foreground shadow-sm">
          {items.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5">
        {items.map((row) => (
          <TrackerCard
            key={row.application._id}
            row={row}
            onMove={onMove}
            isDragging={draggingId === row.application._id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {items.length === 0 ? (
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-3 py-10 text-center transition-colors",
              isOver && isDragging
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-border/80 text-muted-foreground",
            )}
          >
            <p className="text-[12px]">{isOver && isDragging ? "Drop here" : "No roles here"}</p>
          </div>
        ) : isOver && isDragging ? (
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-3 text-center text-[11px] font-medium text-primary">
            Drop to move here
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default function TrackerPage() {
  const rows = useQuery(api.applications.listByUser, {})
  const updateStatus = useMutation(api.applications.updateStatus)

  const [draggingId, setDraggingId] = useState<Id<"applications"> | null>(null)
  const [overColumn, setOverColumn] = useState<Status | null>(null)
  const dragFromRef = useRef<Status | null>(null)
  const dragDepth = useRef<Record<string, number>>({})

  const byStatus = columns.reduce(
    (acc, col) => {
      acc[col.id] = (rows ?? []).filter((r) => r?.application.status === col.id) as Row[]
      return acc
    },
    {} as Record<Status, Row[]>,
  )

  const move = useCallback(
    async (applicationId: Id<"applications">, status: Status) => {
      try {
        await updateStatus({ applicationId, status })
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update")
      }
    },
    [updateStatus],
  )

  function handleDragStart(id: Id<"applications">, status: Status) {
    setDraggingId(id)
    dragFromRef.current = status
    dragDepth.current = {}
  }

  function handleDragEnd() {
    setDraggingId(null)
    dragFromRef.current = null
    setOverColumn(null)
    dragDepth.current = {}
  }

  function handleDragEnter(status: Status) {
    dragDepth.current[status] = (dragDepth.current[status] ?? 0) + 1
    setOverColumn(status)
  }

  function handleDragLeave(status: Status) {
    dragDepth.current[status] = Math.max(0, (dragDepth.current[status] ?? 0) - 1)
    if (dragDepth.current[status] === 0) {
      setOverColumn((current) => (current === status ? null : current))
    }
  }

  async function handleDrop(status: Status, e: DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData(DRAG_MIME) || e.dataTransfer.getData("text/plain")
    const applicationId = raw as Id<"applications">
    const from = dragFromRef.current
    handleDragEnd()

    if (!applicationId || !STATUS_IDS.has(status)) return
    if (from === status) return

    const label = columns.find((c) => c.id === status)?.label ?? status
    await move(applicationId, status)
    toast.success(`Moved to ${label}`)
  }

  const isEmpty = rows?.length === 0
  const total = rows?.length ?? 0
  const isDragging = draggingId !== null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application tracker"
        description="Drag cards between columns — or use the status menu. Each card links to its match report."
        action={
          !isEmpty && rows !== undefined ? (
            <Button asChild size="sm">
              <Link href="/analyze">
                <Sparkles className="size-3.5" />
                New analysis
              </Link>
            </Button>
          ) : undefined
        }
      />

      {rows === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => (
            <div key={col.id} className="h-56 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : isEmpty ? (
        <section className="mac-window">
          <div className="mac-titlebar">
            <div className="mac-traffic-lights" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <span className="flex-1 text-center text-xs font-medium text-muted-foreground">
              Pipeline
            </span>
            <span className="w-[52px]" aria-hidden />
          </div>
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <Kanban className="size-6 text-muted-foreground" />
            </div>
            <div className="max-w-md space-y-2">
              <p className="text-lg font-semibold tracking-tight">No applications yet</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Run an analysis — successful reports land under Saved. Then drag them across Applied
                → Interview → Offer.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/analyze">Run analysis</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">View history</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {total} tracked {total === 1 ? "role" : "roles"}
            {isDragging ? " · Drop on a column to update status" : " · Drag cards to move"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {columns.map((col) => (
              <DropColumn
                key={col.id}
                column={col}
                items={byStatus[col.id]}
                isOver={overColumn === col.id}
                isDragging={isDragging}
                draggingId={draggingId}
                onMove={move}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
