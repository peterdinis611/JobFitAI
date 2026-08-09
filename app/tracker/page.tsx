"use client"

import { useMutation, useQuery } from "convex/react"
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  GripVertical,
  Kanban,
  Sparkles,
  StickyNote,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { type DragEvent, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MetricStrip } from "@/components/ui/metric-strip"
import { PageHeader } from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { roleTitle } from "@/lib/role-label"
import { cn } from "@/lib/utils"

type Status = "saved" | "applied" | "interview" | "offer" | "rejected"

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
  {
    id: "rejected",
    label: "Rejected",
    hint: "Closed",
    accent: "bg-destructive",
    header: "text-destructive",
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

function toDateInputValue(ts: number) {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function followUpLabel(ts: number) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const target = new Date(ts)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 0) return `Overdue · ${formatDate(ts)}`
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  return `Due ${formatDate(ts)}`
}

function TrackerCard({
  row,
  onMove,
  onRemove,
  onSaveNotes,
  onSetFollowUp,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  row: Row
  onMove: (id: Id<"applications">, status: Status) => void
  onRemove: (id: Id<"applications">) => void
  onSaveNotes: (id: Id<"applications">, notes: string) => Promise<void>
  onSetFollowUp: (id: Id<"applications">, followUpAt: number | null) => Promise<void>
  isDragging: boolean
  onDragStart: (id: Id<"applications">, status: Status) => void
  onDragEnd: () => void
}) {
  const { application, analysis, resume, jobPosting } = row
  const title = roleTitle(jobPosting, analysis)
  const [notesOpen, setNotesOpen] = useState(Boolean(application.notes?.trim()))
  const [notesDraft, setNotesDraft] = useState(application.notes ?? "")
  const [savingNotes, setSavingNotes] = useState(false)
  const followUpOverdue =
    application.followUpAt !== undefined && application.followUpAt < Date.now()

  function handleDragStart(e: DragEvent<HTMLElement>) {
    e.dataTransfer.setData(DRAG_MIME, application._id)
    e.dataTransfer.setData("text/plain", application._id)
    e.dataTransfer.effectAllowed = "move"
    onDragStart(application._id, application.status)
  }

  async function persistNotes() {
    const next = notesDraft.trim()
    const prev = (application.notes ?? "").trim()
    if (next === prev) return
    setSavingNotes(true)
    try {
      await onSaveNotes(application._id, notesDraft)
      toast.success("Notes saved")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save notes")
    } finally {
      setSavingNotes(false)
    }
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

      {!notesOpen && application.notes?.trim() ? (
        <p className="mt-2 line-clamp-2 pl-6 text-[11px] text-muted-foreground">
          {application.notes}
        </p>
      ) : null}

      {application.followUpAt ? (
        <p
          className={cn(
            "mt-2 flex items-center gap-1.5 pl-6 text-[11px] font-medium",
            followUpOverdue ? "text-destructive" : "text-warning",
          )}
        >
          <Bell className="size-3 shrink-0" />
          {followUpLabel(application.followUpAt)}
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

        {notesOpen ? (
          <div className="space-y-1.5">
            <Textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => void persistNotes()}
              placeholder="Interview notes, contacts, next steps…"
              className="min-h-[72px] resize-y text-[12px]"
              disabled={savingNotes}
            />
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-[11px]"
                onClick={() => {
                  setNotesDraft(application.notes ?? "")
                  setNotesOpen(Boolean(application.notes?.trim()))
                }}
              >
                Hide
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start gap-1.5 px-2.5 text-[12px] text-muted-foreground"
            onClick={() => {
              setNotesDraft(application.notes ?? "")
              setNotesOpen(true)
            }}
          >
            <StickyNote className="size-3.5" />
            {application.notes?.trim() ? "Edit notes" : "Add notes"}
          </Button>
        )}

        {(application.status === "applied" ||
          application.status === "interview" ||
          application.followUpAt) && (
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`follow-up-${application._id}`}>
              Follow-up date
            </label>
            <input
              id={`follow-up-${application._id}`}
              type="date"
              className="h-8 flex-1 rounded-md border border-input bg-transparent px-2 text-[12px]"
              value={application.followUpAt ? toDateInputValue(application.followUpAt) : ""}
              onChange={(e) => {
                const value = e.target.value
                void onSetFollowUp(
                  application._id,
                  value ? new Date(`${value}T12:00:00`).getTime() : null,
                ).then(() => toast.success(value ? "Follow-up set" : "Follow-up cleared"))
              }}
            />
            {application.followUpAt ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-[11px]"
                onClick={() =>
                  void onSetFollowUp(application._id, null).then(() =>
                    toast.success("Follow-up cleared"),
                  )
                }
              >
                Clear
              </Button>
            ) : null}
          </div>
        )}

        <div className="flex gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 flex-1 justify-between px-2.5 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <Link href={`/analyses/${analysis._id}`} draggable={false}>
              View report
              <ChevronRight className="size-3.5 opacity-60" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove from tracker"
            onClick={() => {
              if (window.confirm(`Remove “${title}” from tracker?`)) {
                void onRemove(application._id)
              }
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
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
  onRemove,
  onSaveNotes,
  onSetFollowUp,
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
  onRemove: (id: Id<"applications">) => void
  onSaveNotes: (id: Id<"applications">, notes: string) => Promise<void>
  onSetFollowUp: (id: Id<"applications">, followUpAt: number | null) => Promise<void>
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
        "mac-window flex min-h-[280px] flex-col overflow-hidden transition-[border-color,background-color,box-shadow]",
        isOver && isDragging
          ? "border-primary bg-primary/8 shadow-[inset_0_0_0_1px] shadow-primary/30"
          : "",
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
      <header className="flex items-center justify-between gap-2 border-b border-border bg-[var(--mac-titlebar)] px-3.5 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 shrink-0 rounded-full", column.accent)} />
            <h2 className={cn("text-[13px] font-semibold", column.header)}>{column.label}</h2>
          </div>
          <p className="mt-0.5 pl-4 text-[11px] text-muted-foreground">{column.hint}</p>
        </div>
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5">
        {items.map((row) => (
          <TrackerCard
            key={row.application._id}
            row={row}
            onMove={onMove}
            onRemove={onRemove}
            onSaveNotes={onSaveNotes}
            onSetFollowUp={onSetFollowUp}
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
  const dueFollowUps = useQuery(api.applications.listDueFollowUps, { withinDays: 7 })
  const updateStatus = useMutation(api.applications.updateStatus)
  const updateNotes = useMutation(api.applications.updateNotes)
  const setFollowUp = useMutation(api.applications.setFollowUp)
  const removeApplication = useMutation(api.applications.remove)

  const [draggingId, setDraggingId] = useState<Id<"applications"> | null>(null)
  const [overColumn, setOverColumn] = useState<Status | null>(null)
  const dragFromRef = useRef<Status | null>(null)
  const dragDepth = useRef<Record<string, number>>({})
  const reminded = useRef(false)

  useEffect(() => {
    if (reminded.current || !dueFollowUps?.length) return
    const overdue = dueFollowUps.filter(
      (r) => r.application.followUpAt !== undefined && r.application.followUpAt < Date.now(),
    ).length
    if (overdue === 0 && dueFollowUps.length === 0) return
    reminded.current = true
    if (overdue > 0) {
      toast.message(`${overdue} follow-up${overdue === 1 ? "" : "s"} overdue`, {
        description: "Check Applied / Interview cards with a bell reminder.",
      })
    } else if (dueFollowUps.length > 0) {
      toast.message(
        `${dueFollowUps.length} follow-up${dueFollowUps.length === 1 ? "" : "s"} this week`,
      )
    }
  }, [dueFollowUps])

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
        const label = columns.find((c) => c.id === status)?.label ?? status
        if (status === "applied") {
          toast.success(`Moved to ${label} · follow-up in 7 days`)
        } else if (status === "interview") {
          toast.success(`Moved to ${label} · follow-up in 3 days`)
        } else {
          toast.success(`Moved to ${label}`)
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update")
      }
    },
    [updateStatus],
  )

  const remove = useCallback(
    async (applicationId: Id<"applications">) => {
      try {
        await removeApplication({ applicationId })
        toast.success("Removed from tracker")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to remove")
      }
    },
    [removeApplication],
  )

  const saveNotes = useCallback(
    async (applicationId: Id<"applications">, notes: string) => {
      await updateNotes({ applicationId, notes })
    },
    [updateNotes],
  )

  const saveFollowUp = useCallback(
    async (applicationId: Id<"applications">, followUpAt: number | null) => {
      await setFollowUp({ applicationId, followUpAt })
    },
    [setFollowUp],
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

    await move(applicationId, status)
  }

  const isEmpty = rows?.length === 0
  const total = rows?.length ?? 0
  const isDragging = draggingId !== null

  const overdueCount =
    dueFollowUps?.filter(
      (r) => r.application.followUpAt !== undefined && r.application.followUpAt < Date.now(),
    ).length ?? 0

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tracker"
        description="Drag roles across the pipeline — notes and follow-ups stay on each card."
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
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {columns.map((col) => (
            <div key={col.id} className="h-56 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : isEmpty ? (
        <section className="mac-window overflow-hidden">
          <div className="border-b border-border bg-[var(--mac-titlebar)] px-4 py-3">
            <h2 className="text-[15px] font-semibold tracking-tight">Pipeline</h2>
            <p className="text-xs text-muted-foreground">Saved → Applied → Interview → Offer</p>
          </div>
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <Kanban className="size-5 text-muted-foreground" />
            </div>
            <div className="max-w-md space-y-1.5">
              <p className="text-[15px] font-semibold tracking-tight">No applications yet</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Successful analyses land under Saved. Drag them through Applied → Interview → Offer
                (or Rejected).
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
          <MetricStrip
            items={[
              { label: "Tracked", value: String(total) },
              {
                label: "Active",
                value: String(byStatus.applied.length + byStatus.interview.length),
                tone: "primary",
              },
              {
                label: "Follow-ups",
                value: String(dueFollowUps?.length ?? 0),
                tone: overdueCount > 0 ? "destructive" : "warning",
              },
            ]}
          />

          {dueFollowUps && dueFollowUps.length > 0 ? (
            <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
              <div className="flex items-start gap-2">
                <Bell className="mt-0.5 size-4 shrink-0 text-warning" />
                <div className="min-w-0 space-y-1.5">
                  <p className="font-medium">
                    {dueFollowUps.length} follow-up{dueFollowUps.length === 1 ? "" : "s"} due soon
                    {isDragging ? " · Drop on a column to move" : null}
                  </p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {dueFollowUps.slice(0, 4).map((row) => {
                      const title = roleTitle(row.jobPosting, row.analysis ?? undefined)
                      const when = row.application.followUpAt
                        ? followUpLabel(row.application.followUpAt)
                        : ""
                      return (
                        <li key={row.application._id} className="flex flex-wrap gap-x-2">
                          <span className="font-medium text-foreground">{title}</span>
                          <span>{when}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ) : isDragging ? (
            <p className="text-xs text-muted-foreground">Drop on a column to update status</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {columns.map((col) => (
              <DropColumn
                key={col.id}
                column={col}
                items={byStatus[col.id]}
                isOver={overColumn === col.id}
                isDragging={isDragging}
                draggingId={draggingId}
                onMove={move}
                onRemove={remove}
                onSaveNotes={saveNotes}
                onSetFollowUp={saveFollowUp}
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
