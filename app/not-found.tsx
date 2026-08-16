import type { Metadata } from "next"
import { NotFoundPage } from "@/components/not-found/not-found-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Page not found",
  description: "This JobFit AI page doesn’t exist or was moved. Head home or open the docs.",
  index: false,
})

export default function NotFound() {
  return <NotFoundPage />
}
