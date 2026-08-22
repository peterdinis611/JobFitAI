/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./schema"

const modules = import.meta.glob("./**/*.ts")

const identity = {
  subject: "clerk_followup",
  email: "followup@jobfit.ai",
}

async function seedTrackedAnalysis(t: ReturnType<typeof convexTest>) {
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
      rawText: "Senior Frontend Engineer\nCompany: Acme",
      cleanedText: "Senior Frontend Engineer\nCompany: Acme",
      title: "Senior Frontend Engineer",
      company: "Acme",
      createdAt: Date.now(),
    })
    const analysisId = await ctx.db.insert("analyses", {
      userId,
      resumeId,
      jobPostingId,
      matchPercentage: 80,
      matchingSkills: ["React"],
      missingSkills: [],
      seniorityFit: "match",
      redFlags: [],
      recommendations: [],
      createdAt: Date.now(),
    })
    const applicationId = await ctx.db.insert("applications", {
      userId,
      analysisId,
      status: "saved",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return { userId, analysisId, applicationId }
  })
}

describe("applications follow-ups", () => {
  it("schedules a 7-day follow-up when moving to Applied", async () => {
    const t = convexTest(schema, modules)
    const { applicationId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)
    const before = Date.now()

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "applied",
    })

    const app = await t.run(async (ctx) => ctx.db.get(applicationId))
    expect(app?.status).toBe("applied")
    expect(app?.followUpAt).toBeGreaterThan(before + 6 * 24 * 60 * 60 * 1000)
    expect(app?.followUpAt).toBeLessThan(before + 8 * 24 * 60 * 60 * 1000)
  })

  it("schedules a 3-day follow-up when moving to Interview", async () => {
    const t = convexTest(schema, modules)
    const { applicationId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)
    const before = Date.now()

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "interview",
    })

    const app = await t.run(async (ctx) => ctx.db.get(applicationId))
    expect(app?.followUpAt).toBeGreaterThan(before + 2 * 24 * 60 * 60 * 1000)
    expect(app?.followUpAt).toBeLessThan(before + 4 * 24 * 60 * 60 * 1000)
  })

  it("does not overwrite an existing follow-up date on later status moves", async () => {
    const t = convexTest(schema, modules)
    const { applicationId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)
    const existing = Date.now() + 2 * 24 * 60 * 60 * 1000
    await t.run(async (ctx) => {
      await ctx.db.patch(applicationId, { followUpAt: existing, status: "applied" })
    })

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "interview",
    })

    const app = await t.run(async (ctx) => ctx.db.get(applicationId))
    expect(app?.status).toBe("interview")
    expect(app?.followUpAt).toBe(existing)
  })

  it("clears follow-up on offer or rejected", async () => {
    const t = convexTest(schema, modules)
    const { applicationId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)
    await t.run(async (ctx) => {
      await ctx.db.patch(applicationId, {
        status: "applied",
        followUpAt: Date.now() + 1000,
      })
    })

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "offer",
    })
    expect((await t.run(async (ctx) => ctx.db.get(applicationId)))?.followUpAt).toBeUndefined()

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "applied",
    })
    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "rejected",
    })
    expect((await t.run(async (ctx) => ctx.db.get(applicationId)))?.followUpAt).toBeUndefined()
  })

  it("lists due follow-ups and respects setFollowUp", async () => {
    const t = convexTest(schema, modules)
    const { applicationId, analysisId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)

    await asUser.mutation(api.applications.updateStatus, {
      applicationId,
      status: "applied",
    })
    await asUser.mutation(api.applications.setFollowUp, {
      applicationId,
      followUpAt: Date.now() - 1000,
    })

    const due = await asUser.query(api.applications.listDueFollowUps, { withinDays: 7 })
    expect(due).toHaveLength(1)
    expect(due[0]?.application._id).toBe(applicationId)
    expect(due[0]?.analysis?._id).toBe(analysisId)
    expect(due[0]?.jobPosting?.company).toBe("Acme")

    await asUser.mutation(api.applications.setFollowUp, {
      applicationId,
      followUpAt: null,
    })
    expect(await asUser.query(api.applications.listDueFollowUps, {})).toEqual([])
  })

  it("hides saved/offer cards from the due list even with a date", async () => {
    const t = convexTest(schema, modules)
    const { applicationId } = await seedTrackedAnalysis(t)
    const asUser = t.withIdentity(identity)
    await t.run(async (ctx) => {
      await ctx.db.patch(applicationId, {
        status: "saved",
        followUpAt: Date.now() - 1000,
      })
    })

    expect(await asUser.query(api.applications.listDueFollowUps, {})).toEqual([])
  })
})
