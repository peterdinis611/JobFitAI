import { absoluteUrl, siteConfig } from "@/lib/site"

/**
 * LLM-oriented site map ([llms.txt](https://llmstxt.org)).
 * Served at `/llms.txt`.
 */
export function buildLlmsTxt(): string {
  const home = absoluteUrl("/")
  const docs = absoluteUrl("/docs")

  return `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} helps job seekers match resumes to roles: upload a CV, analyze a job posting, review fit scores and skill gaps, export reports, and track applications.

## Primary

- [Home](${home}): Product landing and signed-in analysis history
- [Sign in](${absoluteUrl("/sign-in")}): Authenticate with Clerk
- [Sign up](${absoluteUrl("/sign-up")}): Create an account
- [Documentation](${docs}): Product guides, architecture, and reference

## Product (authenticated)

- [Analyze](${absoluteUrl("/analyze")}): Run resume ↔ job match analysis
- [Resumes](${absoluteUrl("/resumes")}): Upload and manage CVs (PDF / DOCX)
- [Tracker](${absoluteUrl("/tracker")}): Kanban-style application tracker
- [Compare](${absoluteUrl("/compare")}): Side-by-side match comparison

## Docs

- [Installation](${docs}/getting-started/installation)
- [First analysis](${docs}/getting-started/first-analysis)
- [User guide — Analyze](${docs}/user-guide/analyze)
- [User guide — Tracker](${docs}/user-guide/tracker)
- [FAQ](${docs}/help/faq)
- [Environment variables](${docs}/reference/environment-variables)
- [Convex API](${docs}/reference/convex-api)

## Optional

- [Sitemap](${absoluteUrl("/sitemap.xml")})
- [Robots](${absoluteUrl("/robots.txt")})
- [Open Graph image](${absoluteUrl("/opengraph-image")})
`
}
