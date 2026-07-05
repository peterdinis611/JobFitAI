import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireUser, requireUserId } from "./lib/auth"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    parsedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const existing = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    const version = existing.length + 1

    for (const resume of existing) {
      if (resume.isActive) {
        await ctx.db.patch(resume._id, { isActive: false })
      }
    }

    return await ctx.db.insert("resumes", {
      userId,
      storageId: args.storageId,
      fileName: args.fileName,
      mimeType: args.mimeType,
      parsedText: args.parsedText,
      version,
      isActive: true,
      createdAt: Date.now(),
    })
  },
})

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx)
    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()
  },
})

export const get = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const resume = await ctx.db.get(args.resumeId)
    if (!resume || resume.userId !== userId) return null
    return resume
  },
})

export const setActive = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx)
    const target = await ctx.db.get(args.resumeId)
    if (!target || target.userId !== userId) {
      throw new Error("Resume not found")
    }

    const all = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    for (const resume of all) {
      await ctx.db.patch(resume._id, { isActive: resume._id === args.resumeId })
    }
  },
})

export const updateParsedText = mutation({
  args: { resumeId: v.id("resumes"), parsedText: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const resume = await ctx.db.get(args.resumeId)
    if (!resume || resume.userId !== userId) {
      throw new Error("Resume not found")
    }
    await ctx.db.patch(args.resumeId, { parsedText: args.parsedText })
  },
})

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireUserId(ctx)
    return await ctx.storage.getUrl(args.storageId)
  },
})
