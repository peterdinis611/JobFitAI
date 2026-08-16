import type { GenericMutationCtx, GenericQueryCtx } from "convex/server"
import type { DataModel, Id } from "../_generated/dataModel"

type Ctx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>

/** Look up the app user row for the Clerk identity (must already be provisioned). */
export async function requireUserId(ctx: Ctx): Promise<Id<"users">> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Not authenticated")

  const user = await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
    .unique()

  if (!user) throw new Error("User not provisioned — call users.ensureCurrentUser first")
  return user._id
}

export async function requireUser(ctx: Ctx) {
  const userId = await requireUserId(ctx)
  const user = await ctx.db.get(userId)
  if (!user) throw new Error("User not found")
  return { userId, user }
}
