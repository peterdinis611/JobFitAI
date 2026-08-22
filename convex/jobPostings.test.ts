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
      cleanedText:
        "Platform Engineer\nCompany: Acme Labs\nLocation: Berlin · Remote\nSalary: €90k\nBuild APIs",
      company: "Acme Labs",
    })

    const job = await t.run(async (ctx) => ctx.db.get(jobPostingId))
    expect(job).toMatchObject({
      title: "Platform Engineer",
      company: "Acme Labs",
      location: "Berlin · Remote",
      salary: "€90k",
      cleanedText:
        "Platform Engineer\nCompany: Acme Labs\nLocation: Berlin · Remote\nSalary: €90k\nBuild APIs",
    })
  })

  it("extracts metadata from cleaned text when fields are omitted", async () => {
    const t = convexTest(schema, modules)
    const { userId, jobPostingId } = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {
        externalId: "clerk_user_meta",
        email: "meta@jobfit.ai",
        createdAt: Date.now(),
      })
      const jobPostingId = await ctx.db.insert("jobPostings", {
        userId,
        source: "text",
        rawText: "placeholder",
        cleanedText: "placeholder",
        createdAt: Date.now(),
      })
      return { userId, jobPostingId }
    })

    await t.mutation(api.jobPostings.updateFromFetch, {
      userId,
      jobPostingId,
      cleanedText: "Staff Engineer at Notion\nLocation: Remote\nSalary: $180k\nBuild product",
    })

    expect(await t.run(async (ctx) => ctx.db.get(jobPostingId))).toMatchObject({
      title: "Staff Engineer at Notion",
      company: "Notion",
      location: "Remote",
      salary: "$180k",
    })
  })

  it("creates a posting with extracted metadata for the signed-in user", async () => {
    const identity = { subject: "clerk_create_job", email: "create@jobfit.ai" }
    const t = convexTest(schema, modules)
    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        externalId: identity.subject,
        email: identity.email,
        createdAt: Date.now(),
      })
    })

    const jobPostingId = await t.withIdentity(identity).mutation(api.jobPostings.create, {
      source: "text",
      rawText:
        "Senior Frontend Engineer\nCompany: Acme Labs\nLocation: Berlin\nSalary: €90k\nReact",
      cleanedText:
        "Senior Frontend Engineer\nCompany: Acme Labs\nLocation: Berlin\nSalary: €90k\nReact",
    })

    expect(await t.run(async (ctx) => ctx.db.get(jobPostingId))).toMatchObject({
      title: "Senior Frontend Engineer",
      company: "Acme Labs",
      location: "Berlin",
      salary: "€90k",
      source: "text",
    })
  })

  it("rejects updateFromFetch for a different user", async () => {
    const t = convexTest(schema, modules)
    const jobPostingId = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {
        externalId: "owner",
        createdAt: Date.now(),
      })
      return ctx.db.insert("jobPostings", {
        userId,
        source: "url",
        rawText: "",
        cleanedText: "",
        createdAt: Date.now(),
      })
    })
    const otherUserId = await t.run(async (ctx) =>
      ctx.db.insert("users", { externalId: "other", createdAt: Date.now() }),
    )

    await expect(
      t.mutation(api.jobPostings.updateFromFetch, {
        userId: otherUserId,
        jobPostingId,
        cleanedText: "Nope",
      }),
    ).rejects.toThrow(/Job posting not found/)
  })
})
