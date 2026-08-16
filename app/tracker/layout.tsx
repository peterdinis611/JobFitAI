import type { Metadata } from "next"
import type { ReactNode } from "react"
import { privatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Tracker",
  description: "Track job applications in JobFit AI.",
}

export default function TrackerLayout({ children }: { readonly children: ReactNode }) {
  return children
}
