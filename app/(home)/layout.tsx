import type { Metadata } from "next"
import type { ReactNode } from "react"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default function HomeLayout({ children }: { readonly children: ReactNode }) {
  return children
}
