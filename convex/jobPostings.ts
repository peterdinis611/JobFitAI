import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireUserId } from "./lib/auth"

export const create = mutation({
  args: {
    source: v.union(v.literal("text"), v.literal("url")),
    rawText: v.string(),
    cleanedText: v.string(),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    return await ctx.db.insert("jobPostings", {
      userId,
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const get = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const job = await ctx.db.get(args.jobPostingId)
    if (!job || job.userId !== userId) return null
    return job
  },
})
