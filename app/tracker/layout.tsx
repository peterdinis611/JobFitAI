import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Application tracker",
  description:
    "Track job applications on a kanban board — from saved reports to interviews and offers.",
  path: "/tracker",
  index: false,
})

export default function TrackerLayout({ children }: { readonly children: ReactNode }) {
  return children
}
