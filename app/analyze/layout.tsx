import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Analyze job fit",
  description:
    "Paste or fetch a job posting, pick a resume, and run an AI match analysis with scores, gaps, and next steps.",
  path: "/analyze",
  index: false,
})

export default function AnalyzeLayout({ children }: { readonly children: ReactNode }) {
  return children
}
