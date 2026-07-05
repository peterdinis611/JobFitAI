import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getOrCreate = mutation({
  args: { externalId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .unique()
    if (existing) return existing._id

    return await ctx.db.insert("users", {
      externalId: args.externalId,
      email: args.email,
      createdAt: Date.now(),
    })
  },
})

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .unique()
  },
})
