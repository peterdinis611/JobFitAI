import { createClerkClient } from "@clerk/backend"
import type { AuthFn } from "eve/channels/auth"

function authorizedParties() {
  const parties = new Set<string>()
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "")
  if (site) parties.add(site)
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) parties.add(`https://${vercel.replace(/\/+$/, "")}`)
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (prod) parties.add(`https://${prod.replace(/\/+$/, "")}`)
  return [...parties]
}

/** Accepts Clerk browser sessions on the eve HTTP channel. */
export const clerkRouteAuth: AuthFn<Request> = async (request) => {
  const secretKey = process.env.CLERK_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!secretKey || !publishableKey) return null

  try {
    const clerk = createClerkClient({ secretKey })
    const parties = authorizedParties()
    const state = await clerk.authenticateRequest(request, {
      secretKey,
      publishableKey,
      ...(parties.length > 0 ? { authorizedParties: parties } : {}),
    })
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
