/// <reference types="vite/client" />
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import schema from "../../convex/schema"

const modules = import.meta.glob("../../convex/**/*.ts")

const owner = {
  subject: "clerk_resume_owner",
  email: "owner@jobfit.ai",
}

const other = {
  subject: "clerk_resume_other",
  email: "other@jobfit.ai",
}

describe("resumes.getFileUrl", () => {
  it("returns a url only for the owner", async () => {
    const t = convexTest(schema, modules)
    const storageId = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {
        externalId: owner.subject,
        email: owner.email,
        createdAt: Date.now(),
      })
      const id = await ctx.storage.store(new Blob(["%PDF-1.4"]))
      await ctx.db.insert("resumes", {
        userId,
        storageId: id,
        fileName: "cv.pdf",
        mimeType: "application/pdf",
        version: 1,
        isActive: true,
        createdAt: Date.now(),
      })
      return id
    })

    const owned = await t.withIdentity(owner).query(api.resumes.getFileUrl, { storageId })
    expect(owned).toEqual(expect.any(String))

    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        externalId: other.subject,
        email: other.email,
        createdAt: Date.now(),
      })
    })
    const leaked = await t
      .withIdentity(other)
      .query(api.resumes.getFileUrl, { storageId: storageId as Id<"_storage"> })
    expect(leaked).toBeNull()
  })
})
