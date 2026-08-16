import type { MetadataRoute } from "next"
import { absoluteUrl, getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs/", "/sign-in", "/sign-up"],
        disallow: [
          "/analyze",
          "/resumes",
          "/tracker",
          "/compare",
          "/analyses/",
          "/api/",
          "/_eve_internal/",
          "/__clerk/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site,
  }
}
