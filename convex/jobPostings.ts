import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireUserId } from "./lib/auth"

function extractJobTitleFromText(text: string): string | undefined {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return undefined
  const labeled = lines.find((l) =>
    /^(job title|role|position|title)\s*[:–-]\s*/i.test(l),
  )
  if (labeled) {
    const title = labeled.replace(/^(job title|role|position|title)\s*[:–-]\s*/i, "").trim()
    if (title.length >= 3 && title.length <= 120) return title
  }
  const first = lines[0]
  if (first.length >= 3 && first.length <= 80 && !first.endsWith(".")) {
    const lower = first.toLowerCase()
    if (
      (/\b(engineer|developer|designer|manager|analyst|architect|lead|director|specialist|consultant|intern)\b/i.test(
        first,
      ) ||
        /^[A-Z][a-zA-Z0-9 /&-]+$/.test(first)) &&
      !lower.startsWith("we are") &&
      !lower.startsWith("about")
    ) {
      return first
    }
  }
  return undefined
}

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
    const title =
      args.title ??
      (args.source === "text" ? extractJobTitleFromText(args.cleanedText) : undefined)
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
    await ctx.db.patch(args.jobPostingId, { title: args.title })
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
    const title =
      args.title ?? extractJobTitleFromText(args.cleanedText) ?? job.title
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
