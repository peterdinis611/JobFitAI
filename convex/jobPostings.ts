import { v } from "convex/values"
import { extractJobTitle } from "../lib/extract-job-title"
import { mutation, query } from "./_generated/server"
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
    const trimmedTitle = args.title?.trim()
    const title =
      trimmedTitle && trimmedTitle.length > 0
        ? trimmedTitle.slice(0, 120)
        : args.source === "text"
          ? extractJobTitle(args.cleanedText)
          : undefined
    return await ctx.db.insert("jobPostings", {
      userId,
      source: args.source,
      rawText: args.rawText,
      cleanedText: args.cleanedText,
      url: args.url,
      title,
      createdAt: Date.now(),
    })
  },
})

export const updateTitle = mutation({
  args: {
    jobPostingId: v.id("jobPostings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const job = await ctx.db.get(args.jobPostingId)
    if (!job || job.userId !== userId) throw new Error("Job posting not found")
    const title = args.title.trim().slice(0, 120)
    await ctx.db.patch(args.jobPostingId, { title: title || undefined })
  },
})

export const updateFromFetch = mutation({
  args: {
    userId: v.id("users"),
    jobPostingId: v.id("jobPostings"),
    title: v.optional(v.string()),
    cleanedText: v.string(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobPostingId)
    if (!job || job.userId !== args.userId) throw new Error("Job posting not found")
    const title = args.title?.trim() || extractJobTitle(args.cleanedText) || job.title
    await ctx.db.patch(args.jobPostingId, {
      cleanedText: args.cleanedText,
      title,
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

/** Agent-trusted: eve tools run without a user JWT and pass userId explicitly. */
export const getForAgent = query({
  args: {
    jobPostingId: v.id("jobPostings"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobPostingId)
    if (!job || job.userId !== args.userId) return null
    return job
  },
})
