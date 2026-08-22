/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./schema"

const modules = import.meta.glob("./**/*.ts")

const identity = {
  subject: "clerk_artifacts",
  email: "artifacts@jobfit.ai",
}

async function seedAnalysis(t: ReturnType<typeof convexTest>) {
  return t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      externalId: identity.subject,
      email: identity.email,
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
      rawText: "Engineer",
      cleanedText: "Engineer",
      title: "Engineer",
      createdAt: Date.now(),
    })
    const analysisId = await ctx.db.insert("analyses", {
      userId,
      resumeId,
      jobPostingId,
      matchPercentage: 70,
      matchingSkills: ["React"],
      missingSkills: [],
      seniorityFit: "match",
      redFlags: [],
      recommendations: [],
      createdAt: Date.now(),
    })
    return { userId, analysisId }
  })
}

const tailoredCv = {
  headline: "Frontend Engineer · React",
  summary: "Ships product with clear ownership and measurable outcomes for the team.",
  experience: [{ heading: "Engineer · Acme", bullets: ["Shipped the dashboard"] }],
  skills: ["React", "TypeScript"],
}

describe("artifacts tailored_cv", () => {
  it("saves and overwrites a tailored CV for the analysis owner", async () => {
    const t = convexTest(schema, modules)
    const { userId, analysisId } = await seedAnalysis(t)

    const firstId = await t.mutation(api.artifacts.save, {
      userId,
      analysisId,
      type: "tailored_cv",
      content: tailoredCv,
    })
    const secondId = await t.mutation(api.artifacts.save, {
      userId,
      analysisId,
      type: "tailored_cv",
      content: { ...tailoredCv, headline: "Updated headline for the role" },
    })
    expect(secondId).toBe(firstId)

    const asUser = t.withIdentity(identity)
    const saved = await asUser.query(api.artifacts.getByType, {
      analysisId,
      type: "tailored_cv",
    })
    expect(saved?.content).toMatchObject({ headline: "Updated headline for the role" })

    const listed = await asUser.query(api.artifacts.listByAnalysis, { analysisId })
    expect(listed).toHaveLength(1)
    expect(listed[0]?.type).toBe("tailored_cv")
  })

  it("rejects save for an analysis owned by someone else", async () => {
    const t = convexTest(schema, modules)
    const { analysisId } = await seedAnalysis(t)
    const otherUserId = await t.run(async (ctx) =>
      ctx.db.insert("users", {
        externalId: "clerk_other_art",
        email: "other@jobfit.ai",
        createdAt: Date.now(),
      }),
    )

    await expect(
      t.mutation(api.artifacts.save, {
        userId: otherUserId,
        analysisId,
        type: "tailored_cv",
        content: tailoredCv,
      }),
    ).rejects.toThrow(/Analysis not found/)
  })
})
