import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Resume library",
  description: "Upload, preview, and manage PDF or DOCX resumes used for JobFit AI match analysis.",
  path: "/resumes",
  index: false,
})

export default function ResumesLayout({ children }: { readonly children: ReactNode }) {
  return children
}
