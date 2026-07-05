"use client"

import Link from "next/link"
import { Suspense } from "react"
import { CompareContent } from "./compare-content"

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
