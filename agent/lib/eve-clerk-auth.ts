import { createClerkClient } from "@clerk/backend"
import type { AuthFn } from "eve/channels/auth"

function addOrigin(parties: Set<string>, value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed) return
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    parties.add(trimmed.replace(/\/+$/, ""))
    return
  }
  parties.add(`https://${trimmed.replace(/\/+$/, "")}`)
}

/** Origins Clerk may list as `azp` on Vercel production and preview hosts. */
export function authorizedPartiesForRequest(request?: Request): string[] {
  const parties = new Set<string>()
  addOrigin(parties, process.env.NEXT_PUBLIC_SITE_URL)
  addOrigin(parties, process.env.VERCEL_URL)
  addOrigin(parties, process.env.VERCEL_BRANCH_URL)
  addOrigin(parties, process.env.VERCEL_PROJECT_PRODUCTION_URL)

  if (request) {
    addOrigin(parties, request.headers.get("origin") ?? undefined)
    const referer = request.headers.get("referer")
    if (referer) {
      try {
        addOrigin(parties, new URL(referer).origin)
      } catch {
        // Ignore malformed Referer — Clerk still verifies the JWT signature.
      }
    }
  }

  return [...parties]
}

/** Accepts Clerk browser sessions (cookie or Bearer) on the eve HTTP channel. */
export const clerkRouteAuth: AuthFn<Request> = async (request) => {
  const secretKey = process.env.CLERK_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!secretKey || !publishableKey) return null

  try {
    const clerk = createClerkClient({ secretKey })
    const base = { secretKey, publishableKey }
    const parties = authorizedPartiesForRequest(request)
    const first = await clerk.authenticateRequest(request, {
      ...base,
      ...(parties.length > 0 ? { authorizedParties: parties } : {}),
    })
    const state =
      first.isSignedIn || parties.length === 0
        ? first
        : await clerk.authenticateRequest(request, base)
    if (!state.isSignedIn) return null
    const { userId } = state.toAuth()
    if (!userId) return null

    return {
      attributes: { clerkUserId: userId },
      authenticator: "clerk",
      issuer: "clerk",
      principalId: userId,
      principalType: "user",
      subject: userId,
    }
  } catch {
    return null
  }
}
