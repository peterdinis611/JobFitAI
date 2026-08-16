/**
 * Canonical site identity for metadata, robots, and sitemap.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://jobfit.ai).
 */
export const siteConfig = {
  name: "JobFit AI",
  shortName: "JobFit",
  tagline: "Match your resume to any role",
  description:
    "AI-powered resume and job posting match analysis. Upload a CV, score fit, close skill gaps, and track applications in one place.",
  keywords: [
    "resume matcher",
    "job fit analysis",
    "AI resume",
    "career tools",
    "job application tracker",
    "skill gap analysis",
    "JobFit AI",
  ],
} as const

/** Absolute origin without trailing slash. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/+$/, "")
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelProd) {
    return `https://${vercelProd.replace(/\/+$/, "")}`
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, "")}`
  }

  return "http://localhost:3000"
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl()
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
