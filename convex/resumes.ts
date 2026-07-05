import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    parsedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const version = existing.length + 1

    for (const resume of existing) {
      if (resume.isActive) {
        await ctx.db.patch(resume._id, { isActive: false })
      }
    }

    return await ctx.db.insert("resumes", {
      userId: args.userId,
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
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

export const get = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.resumeId)
  },
})

export const setActive = mutation({
  args: { userId: v.id("users"), resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.resumeId)
    if (!target || target.userId !== args.userId) {
      throw new Error("Resume not found")
    }

    const all = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    for (const resume of all) {
      await ctx.db.patch(resume._id, { isActive: resume._id === args.resumeId })
    }
  },
})

export const updateParsedText = mutation({
  args: { resumeId: v.id("resumes"), parsedText: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resumeId, { parsedText: args.parsedText })
  },
})

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})
