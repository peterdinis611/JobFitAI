/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "../../convex/_generated/api"
import schema from "../../convex/schema"

const modules = import.meta.glob("../../convex/**/*.ts")

async function seedOwnedJob(t: ReturnType<typeof convexTest>) {
  return t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      externalId: "clerk_user_tester",
      email: "tester@jobfit.ai",
      createdAt: Date.now(),
    })
    const storageId = await ctx.storage.store(new Blob(["resume text"]))
    const resumeId = await ctx.db.insert("resumes", {
      userId,
      storageId,
      fileName: "cv.pdf",
      mimeType: "application/pdf",
      version: 1,
      isActive: true,
      createdAt: Date.now(),
    })
    const jobPostingId = await ctx.db.insert("jobPostings", {
      userId,
      source: "text",
      rawText: "Senior Frontend Engineer\nReact TypeScript",
      cleanedText: "Senior Frontend Engineer\nReact TypeScript",
      title: "Senior Frontend Engineer",
      createdAt: Date.now(),
    })
    return { userId, resumeId, jobPostingId }
  })
}

describe("analyses.create", () => {
  it("saves analysis and auto-creates a Saved application", async () => {
    const t = convexTest(schema, modules)
    const { userId, resumeId, jobPostingId } = await seedOwnedJob(t)

    const analysisId = await t.mutation(api.analyses.create, {
      userId,
      resumeId,
      jobPostingId,
      matchPercentage: 85,
      matchingSkills: ["React", "TypeScript"],
      missingSkills: ["GraphQL"],
      seniorityFit: "match",
      redFlags: [],
      recommendations: ["Highlight React work"],
    })

    const { analysis, application } = await t.run(async (ctx) => {
      const analysis = await ctx.db.get(analysisId)
      const application = await ctx.db
        .query("applications")
        .withIndex("by_analysis", (q) => q.eq("analysisId", analysisId))
        .first()
      return { analysis, application }
    })

    expect(analysis).toMatchObject({
      userId,
      matchPercentage: 85,
      seniorityFit: "match",
    })
    expect(application).toMatchObject({
      userId,
      analysisId,
      status: "saved",
    })
  })

  it("creates exactly one application for a new analysis", async () => {
    const t = convexTest(schema, modules)
    const { userId, resumeId, jobPostingId } = await seedOwnedJob(t)

    const analysisId = await t.mutation(api.analyses.create, {
      userId,
      resumeId,
      jobPostingId,
      matchPercentage: 70,
      matchingSkills: [],
      missingSkills: [],
      seniorityFit: "under",
      redFlags: [],
      recommendations: [],
    })

    const count = await t.run(async (ctx) => {
      const apps = await ctx.db
        .query("applications")
        .withIndex("by_analysis", (q) => q.eq("analysisId", analysisId))
        .collect()
      return apps.length
    })
    expect(count).toBe(1)
  })

  it("rejects resume owned by another user", async () => {
    const t = convexTest(schema, modules)
    const owned = await seedOwnedJob(t)
    const otherUserId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        externalId: "clerk_user_other",
        email: "other@jobfit.ai",
        createdAt: Date.now(),
      }),
    )

    await expect(
      t.mutation(api.analyses.create, {
        userId: otherUserId,
        resumeId: owned.resumeId,
        jobPostingId: owned.jobPostingId,
        matchPercentage: 50,
        matchingSkills: [],
        missingSkills: [],
        seniorityFit: "match",
        redFlags: [],
        recommendations: [],
      }),
    ).rejects.toThrow(/Resume not found/)
  })
})
