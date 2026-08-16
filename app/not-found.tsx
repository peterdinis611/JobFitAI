import type { Metadata } from "next"
import { NotFoundPage } from "@/components/not-found/not-found-page"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or was moved.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundPage />
}
