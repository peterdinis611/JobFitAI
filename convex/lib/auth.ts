import { getAuthUserId } from "@convex-dev/auth/server"
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server"
import type { DataModel } from "../_generated/dataModel"

type Ctx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>

export async function requireUserId(ctx: Ctx) {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")
  return userId
}

export async function requireUser(ctx: Ctx) {
  const userId = await requireUserId(ctx)
  const user = await ctx.db.get(userId)
  if (!user) throw new Error("User not found")
  return { userId, user }
}
