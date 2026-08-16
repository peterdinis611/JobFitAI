/** Client-safe insights from History analyses. */

export type InsightAnalysis = {
  createdAt: number
  matchPercentage: number
  missingSkills: string[]
  archivedAt?: number
}

export type HistoryInsights = {
  trend: { date: number; score: number }[]
  trendDelta: number | null
  topMissing: { skill: string; count: number }[]
}

function normalizeSkill(skill: string) {
  return skill.trim().replace(/\s+/g, " ")
}

export function computeHistoryInsights(
  analyses: InsightAnalysis[],
  opts?: { trendLimit?: number; topLimit?: number },
): HistoryInsights {
  const trendLimit = opts?.trendLimit ?? 8
  const topLimit = opts?.topLimit ?? 6

  const active = analyses.filter((a) => a.archivedAt === undefined)
  const chronological = [...active].sort((a, b) => a.createdAt - b.createdAt)
  const trendSlice = chronological.slice(-trendLimit)
  const trend = trendSlice.map((a) => ({ date: a.createdAt, score: a.matchPercentage }))

  let trendDelta: number | null = null
  if (trend.length >= 2) {
    trendDelta = trend[trend.length - 1].score - trend[0].score
  }

  const counts = new Map<string, number>()
  for (const a of active) {
    const seen = new Set<string>()
    for (const raw of a.missingSkills) {
      const skill = normalizeSkill(raw)
      if (!skill) continue
      const key = skill.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      counts.set(skill, (counts.get(skill) ?? 0) + 1)
    }
  }

  const topMissing = [...counts.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
    .slice(0, topLimit)

  return { trend, trendDelta, topMissing }
}
