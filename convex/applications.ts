import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { requireUser, requireUserId } from "./lib/auth"

const applicationStatus = v.union(
  v.literal("saved"),
  v.literal("applied"),
  v.literal("interview"),
  v.literal("offer"),
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
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: Date.now(),
    })
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
