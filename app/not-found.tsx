import type { Metadata } from "next"
import { NotFoundPage } from "@/components/not-found/not-found-page"

export const metadata: Metadata = {
  title: "Page not found — JobFit AI",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return <NotFoundPage />
}
