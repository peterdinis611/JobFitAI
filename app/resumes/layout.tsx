import type { Metadata } from "next"
import type { ReactNode } from "react"
import { privatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Resumes",
  description: "Manage uploaded resumes in JobFit AI.",
}

export default function ResumesLayout({ children }: { readonly children: ReactNode }) {
  return children
}
