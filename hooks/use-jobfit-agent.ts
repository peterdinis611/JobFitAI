"use client"

import { useAuth } from "@clerk/nextjs"
import { useEveAgent } from "eve/react"

/**
 * Same-origin eve client that sends the Clerk session JWT.
 * Required on Vercel: `/eve/v1/*` is a separate service and often drops
 * `__session` cookies or fails Clerk `azp` checks against the internal host.
 */
export function useJobFitAgent() {
  const { getToken } = useAuth()

  return useEveAgent({
    headers: async (): Promise<Record<string, string>> => {
      try {
        const token = await getToken()
        if (!token) return {}
        return { authorization: `Bearer ${token}` }
      } catch {
        return {}
      }
    },
  })
}
