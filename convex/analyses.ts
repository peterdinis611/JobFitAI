import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { requireUser, requireUserId } from "./lib/auth"

const skillCategory = v.object({
  name: v.string(),
  score: v.number(),
  matched: v.array(v.string()),
  missing: v.array(v.string()),
})

async function assertResumeOwned(
  ctx: { db: { get: (id: Id<"resumes">) => Promise<{ userId: Id<"users"> } | null> } },
  resumeId: Id<"resumes">,
  userId: Id<"users">,
) {
  const resume = await ctx.db.get(resumeId)
  if (!resume || resume.userId !== userId) throw new Error("Resume not found")
}

async function assertJobOwned(
  ctx: { db: { get: (id: Id<"jobPostings">) => Promise<{ userId: Id<"users"> } | null> } },
  jobPostingId: Id<"jobPostings">,
  userId: Id<"users">,
) {
  const job = await ctx.db.get(jobPostingId)
  if (!job || job.userId !== userId) throw new Error("Job posting not found")
}

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
    previousAnalysisId: v.optional(v.id("analyses")),
  },
  handler: async (ctx, args) => {
    await assertResumeOwned(ctx, args.resumeId, args.userId)
    await assertJobOwned(ctx, args.jobPostingId, args.userId)

    if (args.previousAnalysisId) {
      const prev = await ctx.db.get(args.previousAnalysisId)
      if (!prev || prev.userId !== args.userId) {
        throw new Error("Previous analysis not found")
      }
    }

    return await ctx.db.insert("analyses", {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const listByUser = query({
  args: {
    minMatch: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const rows = await ctx.db
      .query("analyses")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()

    const filtered =
      args.minMatch === undefined ? rows : rows.filter((r) => r.matchPercentage >= args.minMatch!)

    return await Promise.all(
      filtered.map(async (analysis) => {
        const [resume, jobPosting] = await Promise.all([
          ctx.db.get(analysis.resumeId),
          ctx.db.get(analysis.jobPostingId),
        ])
        return { analysis, resume, jobPosting }
      }),
    )
  },
})

export const get = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) return null
    return analysis
  },
})

export const getWithRelations = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) return null

    const [resume, jobPosting] = await Promise.all([
      ctx.db.get(analysis.resumeId),
      ctx.db.get(analysis.jobPostingId),
    ])

    return { analysis, resume, jobPosting }
  },
})

export const getRescoreDelta = query({
  args: { analysisId: v.id("analyses") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const analysis = await ctx.db.get(args.analysisId)
    if (!analysis || analysis.userId !== userId) return null
    if (!analysis.previousAnalysisId) return null

    const previous = await ctx.db.get(analysis.previousAnalysisId)
    if (!previous) return null

    return {
      current: analysis.matchPercentage,
      previous: previous.matchPercentage,
      delta: analysis.matchPercentage - previous.matchPercentage,
      previousAnalysisId: previous._id,
    }
  },
})
