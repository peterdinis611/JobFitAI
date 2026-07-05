"use client"

import { useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getClientUserId } from "@/lib/user-id"
import type { Id } from "@/convex/_generated/dataModel"

export function useJobFitUser() {
  const externalId = getClientUserId()
  const getOrCreate = useMutation(api.users.getOrCreate)
  const [userId, setUserId] = useState<Id<"users"> | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void getOrCreate({ externalId }).then((id) => {
      if (!cancelled) {
        setUserId(id)
        setReady(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [externalId, getOrCreate])

  return { userId, ready, externalId }
}
