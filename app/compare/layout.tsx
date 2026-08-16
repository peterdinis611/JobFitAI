import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Compare matches",
  description:
    "Compare multiple JobFit AI analyses side by side to see which roles fit your resume best.",
  path: "/compare",
  index: false,
})

export default function CompareLayout({ children }: { readonly children: ReactNode }) {
  return children
}
