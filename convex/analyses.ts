import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const skillCategory = v.object({
  name: v.string(),
  score: v.number(),
  matched: v.array(v.string()),
  missing: v.array(v.string()),
})

export const create = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    jobPostingId: v.id("jobPostings"),
    matchPercentage: v.number(),
    matchingSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    seniorityFit: v.union(v.literal("under"), v.literal("match"), v.literal("over")),
    redFlags: v.array(v.string()),
    recommendations: v.array(v.string()),
    skillCategories: v.optional(v.array(skillCategory)),
    eveSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const listByUser = query({
  args: {
    userId: v.id("users"),
    minMatch: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("analyses")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    if (args.minMatch === undefined) return rows
    return rows.filter((r) => r.matchPercentage >= args.minMatch!)
  },
})

export const get = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.analysisId)
  },
})

export const getWithRelations = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis) return null

    const [resume, jobPosting] = await Promise.all([
      ctx.db.get(analysis.resumeId),
      ctx.db.get(analysis.jobPostingId),
    ])

    return { analysis, resume, jobPosting }
  },
})
