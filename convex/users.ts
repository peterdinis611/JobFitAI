import { mutation, query } from "./_generated/server"

/** Current app user for the signed-in Clerk identity. */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique()
  },
})

/** Upsert Convex `users` row from Clerk JWT (call once after sign-in). */
export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique()

    const patch = {
      email: identity.email,
      name: identity.name ?? identity.nickname,
      image: identity.pictureUrl,
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
      return existing._id
    }

    return await ctx.db.insert("users", {
      externalId: identity.subject,
      email: patch.email,
      name: patch.name,
      image: patch.image,
      createdAt: Date.now(),
    })
  },
})
