"use client"

import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { useEffect } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export function useJobFitUser() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser)
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip")

  useEffect(() => {
    if (!isAuthenticated) return
    if (viewer) return
    void ensureCurrentUser({})
  }, [isAuthenticated, viewer, ensureCurrentUser])

  return {
    userId: (viewer?._id ?? null) as Id<"users"> | null,
    email: viewer?.email ?? null,
    ready: !isLoading && (isAuthenticated ? Boolean(viewer) : true),
    isAuthenticated,
    isLoading,
  }
}
