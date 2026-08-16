import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { MetadataRoute } from "next"
import { absoluteUrl, getSiteUrl } from "@/lib/site"

type SitemapEntry = MetadataRoute.Sitemap[number]

function docsSitemapEntries(): SitemapEntry[] {
  const docsSitemapPath = join(process.cwd(), "public/docs/sitemap.xml")
  if (!existsSync(docsSitemapPath)) return []

  const xml = readFileSync(docsSitemapPath, "utf8")
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]?.trim()).filter(Boolean)
  const site = getSiteUrl()
  const now = new Date()

  const entries: SitemapEntry[] = []
  const seen = new Set<string>()

  for (const loc of locs) {
    if (!loc) continue
    let pathname: string
    try {
      pathname = new URL(loc).pathname
    } catch {
      continue
    }

    // Skip noisy / low-value docs routes
    if (pathname.includes("/search")) continue

    const url = `${site}${pathname.endsWith("/") && pathname !== "/docs/" ? pathname.slice(0, -1) : pathname}`
    if (seen.has(url)) continue
    seen.add(url)

    const isHub = pathname === "/docs" || pathname === "/docs/"
    entries.push({
      url: isHub ? absoluteUrl("/docs") : url,
      lastModified: now,
      changeFrequency: isHub ? "weekly" : "monthly",
      priority: isHub ? 0.8 : 0.55,
    })
  }

  return entries
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const appEntries: SitemapEntry[] = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/docs"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/sign-in"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/sign-up"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  const byUrl = new Map<string, SitemapEntry>()
  for (const entry of [...appEntries, ...docsSitemapEntries()]) {
    byUrl.set(entry.url, entry)
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url))
}
