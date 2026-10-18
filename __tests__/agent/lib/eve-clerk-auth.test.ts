import { afterEach, describe, expect, it } from "vitest"
import { authorizedPartiesForRequest, clerkRouteAuth } from "#lib/eve-clerk-auth"

describe("clerkRouteAuth", () => {
  const previousSecret = process.env.CLERK_SECRET_KEY
  const previousPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  afterEach(() => {
    if (previousSecret === undefined) delete process.env.CLERK_SECRET_KEY
    else process.env.CLERK_SECRET_KEY = previousSecret
    if (previousPublishable === undefined) delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    else process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = previousPublishable
  })

  it("skips when Clerk keys are missing", async () => {
    delete process.env.CLERK_SECRET_KEY
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    await expect(
      clerkRouteAuth(new Request("https://example.com/eve/v1/session")),
    ).resolves.toBeNull()
  })
})

describe("authorizedPartiesForRequest", () => {
  const previous = {
    site: process.env.NEXT_PUBLIC_SITE_URL,
    vercel: process.env.VERCEL_URL,
    branch: process.env.VERCEL_BRANCH_URL,
    prod: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  }

  afterEach(() => {
    restoreEnv("NEXT_PUBLIC_SITE_URL", previous.site)
    restoreEnv("VERCEL_URL", previous.vercel)
    restoreEnv("VERCEL_BRANCH_URL", previous.branch)
    restoreEnv("VERCEL_PROJECT_PRODUCTION_URL", previous.prod)
  })

  it("collects Vercel hosts and the inbound Origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://jobfit.example/"
    process.env.VERCEL_URL = "jobfit-ai-git-main.vercel.app"
    process.env.VERCEL_BRANCH_URL = "jobfit-ai-git-feat.vercel.app"
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "jobfit-ai.vercel.app"

    const parties = authorizedPartiesForRequest(
      new Request("https://jobfit-ai-git-feat.vercel.app/eve/v1/session", {
        headers: {
          origin: "https://jobfit-ai-git-feat.vercel.app",
          referer: "https://jobfit-ai-git-feat.vercel.app/analyze",
        },
      }),
    )

    expect(parties).toEqual(
      expect.arrayContaining([
        "https://jobfit.example",
        "https://jobfit-ai-git-main.vercel.app",
        "https://jobfit-ai-git-feat.vercel.app",
        "https://jobfit-ai.vercel.app",
      ]),
    )
  })
})

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}
