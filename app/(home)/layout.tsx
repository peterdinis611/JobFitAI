import type { Metadata } from "next"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = createPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description:
    "Calibrate resume fit against any job posting. Upload a CV, score matches, close skill gaps, and track applications with JobFit AI.",
  path: "/",
  absoluteTitle: true,
})

export default function HomeLayout({ children }: { readonly children: ReactNode }) {
  return children
}
