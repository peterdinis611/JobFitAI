import type { Metadata } from "next"
import type { ReactNode } from "react"
import { privatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: "Compare",
  description: "Compare job matches side by side in JobFit AI.",
}

export default function CompareLayout({ children }: { readonly children: ReactNode }) {
  return children
}
