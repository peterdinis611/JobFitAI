import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireUserId } from "./lib/auth"

const applicationStatus = v.union(
  v.literal("saved"),
  v.literal("applied"),
  v.literal("interview"),
  v.literal("offer"),
  v.literal("rejected"),
)

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx)
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()

    return await Promise.all(
      apps.map(async (app) => {
        const analysis = await ctx.db.get(app.analysisId)
        if (!analysis) return null
        const [resume, jobPosting] = await Promise.all([
          ctx.db.get(analysis.resumeId),
          ctx.db.get(analysis.jobPostingId),
        ])
        return { application: app, analysis, resume, jobPosting }
      }),
    ).then((rows) => rows.filter(Boolean))
  },
})

export const getByAnalysis = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const app = await ctx.db
      .query("applications")
      .withIndex("by_analysis", (q) => q.eq("analysisId", args.analysisId))
      .first()
    if (!app || app.userId !== userId) return null
    return app
  },
})

export const create = mutation({
  args: {
    analysisId: v.id("analyses"),
    status: v.optional(applicationStatus),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) throw new Error("Analysis not found")

    const existing = await ctx.db
      .query("applications")
      .withIndex("by_analysis", (q) => q.eq("analysisId", args.analysisId))
      .first()
    if (existing) return existing._id

    const now = Date.now()
    return await ctx.db.insert("applications", {
      userId,
      analysisId: args.analysisId,
      status: args.status ?? "saved",
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: applicationStatus,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const app = await ctx.db.get(args.applicationId)
    if (!app || app.userId !== userId) throw new Error("Application not found")

    const now = Date.now()
    const next: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    }

    if (args.status === "offer" || args.status === "rejected") {
      next.followUpAt = undefined
    } else if (
      (args.status === "applied" || args.status === "interview") &&
      app.followUpAt === undefined
    ) {
      const days = args.status === "interview" ? 3 : 7
      next.followUpAt = now + days * 24 * 60 * 60 * 1000
    }

    await ctx.db.patch(args.applicationId, next)
  },
})

export const updateNotes = mutation({
  args: {
    applicationId: v.id("applications"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const app = await ctx.db.get(args.applicationId)
    if (!app || app.userId !== userId) throw new Error("Application not found")
    const trimmed = args.notes.trim()
    await ctx.db.patch(args.applicationId, {
      notes: trimmed.length > 0 ? trimmed : undefined,
      updatedAt: Date.now(),
    })
  },
})

export const setFollowUp = mutation({
  args: {
    applicationId: v.id("applications"),
    followUpAt: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const app = await ctx.db.get(args.applicationId)
    if (!app || app.userId !== userId) throw new Error("Application not found")
    await ctx.db.patch(args.applicationId, {
      followUpAt: args.followUpAt === null ? undefined : args.followUpAt,
      updatedAt: Date.now(),
    })
  },
})

export const listDueFollowUps = query({
  args: {
    withinDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const withinMs = (args.withinDays ?? 7) * 24 * 60 * 60 * 1000
    const horizon = Date.now() + withinMs

    const apps = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    const due = apps
      .filter(
        (app) =>
          app.followUpAt !== undefined &&
          app.followUpAt <= horizon &&
          (app.status === "applied" || app.status === "interview"),
      )
      .sort((a, b) => (a.followUpAt ?? 0) - (b.followUpAt ?? 0))

    return await Promise.all(
      due.map(async (app) => {
        const analysis = await ctx.db.get(app.analysisId)
        const jobPosting = analysis ? await ctx.db.get(analysis.jobPostingId) : null
        return { application: app, analysis, jobPosting }
      }),
    )
  },
})

export const remove = mutation({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const app = await ctx.db.get(args.applicationId)
    if (!app || app.userId !== userId) throw new Error("Application not found")
    await ctx.db.delete(args.applicationId)
  },
})
