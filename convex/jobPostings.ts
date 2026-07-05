import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const create = mutation({
  args: {
    userId: v.id("users"),
    source: v.union(v.literal("text"), v.literal("url")),
    rawText: v.string(),
    cleanedText: v.string(),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobPostings", {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const get = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobPostingId)
  },
})
