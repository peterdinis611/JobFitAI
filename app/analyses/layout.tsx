import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Analysis report",
  description:
    "View a detailed JobFit AI match report with score breakdown, missing skills, and export options.",
  path: "/analyses",
  index: false,
})

export default function AnalysesLayout({ children }: { readonly children: ReactNode }) {
  return children
}
