"use client"

import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { ChevronRight, Kanban } from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const columns = [
  { id: "saved" as const, label: "Saved", color: "border-border bg-muted/30" },
  { id: "applied" as const, label: "Applied", color: "border-primary/30 bg-primary/5" },
  { id: "interview" as const, label: "Interview", color: "border-warning/30 bg-warning/5" },
  { id: "offer" as const, label: "Offer", color: "border-success/30 bg-success/5" },
]

type Row = {
  application: Doc<"applications">
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

export default function TrackerPage() {
  const rows = useQuery(api.applications.listByUser, {})
  const updateStatus = useMutation(api.applications.updateStatus)

  const byStatus = columns.reduce(
    (acc, col) => {
      acc[col.id] = (rows ?? []).filter((r) => r?.application.status === col.id) as Row[]
      return acc
    },
    {} as Record<(typeof columns)[number]["id"], Row[]>,
  )

  async function move(applicationId: Id<"applications">, status: Row["application"]["status"]) {
    try {
      await updateStatus({ applicationId, status })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update")
    }
  }

  const isEmpty = rows?.length === 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="Application tracker"
        description="Track roles from saved through offer — linked to your match analyses"
      />

      {rows === undefined ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : isEmpty ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Kanban className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No tracked applications yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Open an analysis report and click &quot;Save to tracker&quot;
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">View analyses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">{col.label}</h2>
                <Badge variant="secondary">{byStatus[col.id].length}</Badge>
              </div>
              <div className={cn("min-h-[200px] space-y-2 rounded-xl border p-2", col.color)}>
                {byStatus[col.id].map(({ application, analysis, jobPosting }, i) => (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="border-border/60 bg-card shadow-sm">
                      <CardHeader className="space-y-2 p-3 pb-2">
                        <CardTitle className="line-clamp-2 text-sm leading-snug">
                          {jobPosting?.title ?? "Untitled role"}
                        </CardTitle>
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              analysis.matchPercentage >= 70 && "bg-success/15 text-success",
                            )}
                          >
                            {analysis.matchPercentage}% match
                          </Badge>
                          <Select
                            value={application.status}
                            onValueChange={(v) =>
                              void move(application._id, v as typeof application.status)
                            }
                          >
                            <SelectTrigger className="h-7 w-[110px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {columns.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <Button asChild variant="ghost" size="sm" className="h-7 w-full text-xs">
                          <Link href={`/analyses/${analysis._id}`}>
                            View report <ChevronRight className="size-3" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {byStatus[col.id].length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">Empty</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
