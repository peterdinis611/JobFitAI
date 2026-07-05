import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { requireUserId } from "./lib/auth"

const artifactType = v.union(
  v.literal("tailored_bullets"),
  v.literal("cover_letter"),
  v.literal("learning_plan"),
)

async function assertAnalysisOwned(
  ctx: { db: { get: (id: Id<"analyses">) => Promise<{ userId: Id<"users"> } | null> } },
  analysisId: Id<"analyses">,
  userId: Id<"users">,
) {
  const analysis = await ctx.db.get(analysisId)
  if (!analysis || analysis.userId !== userId) throw new Error("Analysis not found")
}

export const listByAnalysis = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) return []

    return await ctx.db
      .query("artifacts")
      .withIndex("by_analysis_type", (q) => q.eq("analysisId", args.analysisId))
      .collect()
  },
})

export const getByType = query({
  args: {
    analysisId: v.id("analyses"),
    type: artifactType,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) return null

    return await ctx.db
      .query("artifacts")
      .withIndex("by_analysis_type", (q) =>
        q.eq("analysisId", args.analysisId).eq("type", args.type),
      )
      .order("desc")
      .first()
  },
})

export const save = mutation({
  args: {
    userId: v.id("users"),
    analysisId: v.id("analyses"),
    type: artifactType,
    content: v.any(),
  },
  handler: async (ctx, args) => {
    await assertAnalysisOwned(ctx, args.analysisId, args.userId)

    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_analysis_type", (q) =>
        q.eq("analysisId", args.analysisId).eq("type", args.type),
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content, createdAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert("artifacts", {
      userId: args.userId,
      analysisId: args.analysisId,
      type: args.type,
      content: args.content,
      createdAt: Date.now(),
    })
  },
})

export const saveForUser = mutation({
  args: {
    analysisId: v.id("analyses"),
    type: artifactType,
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    await assertAnalysisOwned(ctx, args.analysisId, userId)

    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_analysis_type", (q) =>
        q.eq("analysisId", args.analysisId).eq("type", args.type),
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content, createdAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert("artifacts", {
      userId,
      analysisId: args.analysisId,
      type: args.type,
      content: args.content,
      createdAt: Date.now(),
    })
  },
})
