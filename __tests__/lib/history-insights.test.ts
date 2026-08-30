import { describe, expect, it } from "vitest"
import { computeHistoryInsights } from "@/lib/history-insights"

describe("computeHistoryInsights", () => {
  it("computes trend delta and top missing skills", () => {
    const insights = computeHistoryInsights([
      {
        createdAt: 1,
        matchPercentage: 60,
        missingSkills: ["GraphQL", "AWS"],
      },
      {
        createdAt: 2,
        matchPercentage: 70,
        missingSkills: ["GraphQL", "Kubernetes"],
      },
      {
        createdAt: 3,
        matchPercentage: 80,
        missingSkills: ["GraphQL"],
      },
    ])

    expect(insights.trend).toHaveLength(3)
    expect(insights.trendDelta).toBe(20)
    expect(insights.topMissing[0]).toEqual({ skill: "GraphQL", count: 3 })
    expect(insights.topMissing.map((s) => s.skill)).toContain("AWS")
  })

  it("ignores archived analyses for counts", () => {
    const insights = computeHistoryInsights([
      {
        createdAt: 1,
        matchPercentage: 50,
        missingSkills: ["Rust"],
        archivedAt: 99,
      },
      {
        createdAt: 2,
        matchPercentage: 75,
        missingSkills: ["Rust"],
      },
    ])

    expect(insights.trend).toHaveLength(1)
    expect(insights.trendDelta).toBeNull()
    expect(insights.topMissing).toEqual([{ skill: "Rust", count: 1 }])
  })
})
