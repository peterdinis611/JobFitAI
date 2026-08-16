import type { Metadata } from "next"
import { absoluteUrl, siteConfig } from "@/lib/site"

/** Authenticated app surfaces — keep out of search indexes. */
export const privatePageRobots = {
  index: false,
  follow: false,
  nocache: true,
} as const satisfies NonNullable<Metadata["robots"]>

export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  type: "image/png",
} as const

type PageMetaInput = {
  title: string
  description: string
  /** Canonical path; omit for non-indexable utility pages like 404. */
  path?: string
  /** Use absolute title (skip `%s · JobFit AI` template). */
  absoluteTitle?: boolean
  index?: boolean
}

/** Unique title + description + OG/Twitter + canonical per route. */
export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  index = true,
}: PageMetaInput): Metadata {
  const url = path ? absoluteUrl(path) : absoluteUrl("/")
  const fullTitle = absoluteTitle ? title : undefined

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    robots: index ? { index: true, follow: true } : privatePageRobots,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: fullTitle ?? `${title} · ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle ?? `${title} · ${siteConfig.name}`,
      description,
      images: [ogImage.url],
    },
  }
}

export const privatePageMetadata = {
  robots: privatePageRobots,
} as const satisfies Metadata
