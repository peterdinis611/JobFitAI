import type { Metadata } from "next"
import type { ReactNode } from "react"
import { privatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Analysis",
  description: "View a JobFit AI match analysis report.",
}

export default function AnalysesLayout({ children }: { readonly children: ReactNode }) {
  return children
}
