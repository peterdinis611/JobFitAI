import { mutation } from "./_generated/server"
import { requireUserId } from "./lib/auth"

const DAILY_LIMIT = 20

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export const checkAndIncrement = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx)
    const date = todayKey()
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .unique()

    if (!existing) {
      await ctx.db.insert("rateLimits", {
        userId,
        date,
        analysisCount: 1,
      })
      return { allowed: true, remaining: DAILY_LIMIT - 1 }
    }

    if (existing.analysisCount >= DAILY_LIMIT) {
      return { allowed: false, remaining: 0 }
    }

    await ctx.db.patch(existing._id, {
      analysisCount: existing.analysisCount + 1,
    })

    return {
      allowed: true,
      remaining: DAILY_LIMIT - existing.analysisCount - 1,
    }
  },
})
