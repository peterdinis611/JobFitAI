import { afterEach, describe, expect, it } from "vitest"
import { clerkRouteAuth } from "#lib/eve-clerk-auth"

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
