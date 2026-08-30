import { describe, expect, it } from "vitest"
import { extractJsonLdJobMeta } from "#lib/fetch-job"

const LONG_DESC =
  "We are hiring a platform engineer to build APIs, own reliability, and work with product on the next set of customer-facing services for our core marketplace."

function jobPostingHtml(payload: unknown): string {
  return `<html><head><title>Careers</title>
<script type="application/ld+json">${JSON.stringify(payload)}</script>
</head><body><p>${LONG_DESC}</p></body></html>`
}

describe("extractJsonLdJobMeta", () => {
  it("reads title, company, location, salary, and description from JobPosting", () => {
    const meta = extractJsonLdJobMeta(
      jobPostingHtml({
        "@type": "JobPosting",
        title: "Platform Engineer",
        hiringOrganization: { name: "Acme Labs" },
        jobLocation: {
          address: { addressLocality: "Berlin", addressCountry: "DE" },
        },
        baseSalary: { currency: "EUR", value: { minValue: 90000, maxValue: 110000 } },
        description: `<p>${LONG_DESC}</p>`,
      }),
    )

    expect(meta.title).toBe("Platform Engineer")
    expect(meta.company).toBe("Acme Labs")
    expect(meta.location).toBe("Berlin, DE")
    expect(meta.salary).toBe("EUR 90000–110000")
    expect(meta.cleanedText).toContain("Platform Engineer")
    expect(meta.cleanedText).toContain("platform engineer")
  })

  it("marks remote jobLocationType", () => {
    const meta = extractJsonLdJobMeta(
      jobPostingHtml({
        "@type": "JobPosting",
        title: "Staff Engineer",
        hiringOrganization: "Notion",
        jobLocationType: "TELECOMMUTE",
        jobLocation: { address: { addressLocality: "Lisbon" } },
        description: LONG_DESC,
      }),
    )
    expect(meta.company).toBe("Notion")
    expect(meta.location).toBe("Lisbon · Remote")
  })

  it("ignores non-job JSON-LD and invalid scripts", () => {
    const html = `<html>
<script type="application/ld+json">{"@type":"Organization","name":"Nope"}</script>
<script type="application/ld+json">{not-json</script>
</html>`
    expect(extractJsonLdJobMeta(html)).toEqual({ cleanedText: undefined })
  })
})
