import { v } from "convex/values"
import { extractJobMetadata } from "../lib/extract-job-metadata"
import { mutation, query } from "./_generated/server"
import { requireUserId } from "./lib/auth"

function trimField(value: string | undefined, max = 120): string | undefined {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed.slice(0, max) : undefined
}

export const create = mutation({
  args: {
    source: v.union(v.literal("text"), v.literal("url")),
    rawText: v.string(),
    cleanedText: v.string(),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const extracted = extractJobMetadata(args.cleanedText, args.url)
    const title = trimField(args.title) ?? (args.source === "text" ? extracted.title : undefined)
    return await ctx.db.insert("jobPostings", {
      userId,
      source: args.source,
      rawText: args.rawText,
      cleanedText: args.cleanedText,
      url: args.url,
      title,
      company: trimField(args.company, 80) ?? extracted.company,
      location: trimField(args.location, 80) ?? extracted.location,
      salary: trimField(args.salary, 80) ?? extracted.salary,
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
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobPostingId)
    if (!job || job.userId !== args.userId) throw new Error("Job posting not found")
    const extracted = extractJobMetadata(args.cleanedText, job.url)
    const title = trimField(args.title) || extracted.title || job.title
    await ctx.db.patch(args.jobPostingId, {
      cleanedText: args.cleanedText,
      title,
      company: trimField(args.company, 80) ?? extracted.company ?? job.company,
      location: trimField(args.location, 80) ?? extracted.location ?? job.location,
      salary: trimField(args.salary, 80) ?? extracted.salary ?? job.salary,
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
