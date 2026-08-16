/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./schema"

const modules = import.meta.glob("./**/*.ts")

describe("jobPostings.updateFromFetch", () => {
  it("updates cleaned text and title for the owning user", async () => {
    const t = convexTest(schema, modules)
    const { userId, jobPostingId } = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {
        externalId: "clerk_user_fetch",
        email: "fetch@jobfit.ai",
        createdAt: Date.now(),
      })
      const jobPostingId = await ctx.db.insert("jobPostings", {
        userId,
        source: "url",
        rawText: "",
        cleanedText: "",
        url: "https://example.com/jobs/1",
        createdAt: Date.now(),
      })
      return { userId, jobPostingId }
    })

    await t.mutation(api.jobPostings.updateFromFetch, {
      userId,
      jobPostingId,
      title: "Platform Engineer",
      cleanedText: "Platform Engineer\nBuild APIs",
    })

    const job = await t.run(async (ctx) => ctx.db.get(jobPostingId))
    expect(job).toMatchObject({
      title: "Platform Engineer",
      cleanedText: "Platform Engineer\nBuild APIs",
    })
  })
})
