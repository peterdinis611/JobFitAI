"use client"

import { useConvexAuth } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export function useJobFitUser() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip")

  return {
    userId: (viewer?._id ?? null) as Id<"users"> | null,
    email: viewer?.email ?? null,
    ready: !isLoading && (isAuthenticated ? viewer !== undefined : true),
    isAuthenticated,
    isLoading,
  }
}
