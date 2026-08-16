import type { Metadata } from "next"
import type { ReactNode } from "react"
import { privatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Analyze",
  description: "Match a resume against a job posting with JobFit AI.",
}

export default function AnalyzeLayout({ children }: { readonly children: ReactNode }) {
  return children
}
