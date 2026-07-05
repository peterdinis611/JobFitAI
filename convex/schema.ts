import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_external_id", ["externalId"]),

  resumes: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    parsedText: v.optional(v.string()),
    version: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  jobPostings: defineTable({
    userId: v.id("users"),
    source: v.union(v.literal("text"), v.literal("url")),
    rawText: v.string(),
    cleanedText: v.string(),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  analyses: defineTable({
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    jobPostingId: v.id("jobPostings"),
    matchPercentage: v.number(),
    matchingSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    seniorityFit: v.union(v.literal("under"), v.literal("match"), v.literal("over")),
    redFlags: v.array(v.string()),
    recommendations: v.array(v.string()),
    skillCategories: v.optional(
      v.array(
        v.object({
          name: v.string(),
          score: v.number(),
          matched: v.array(v.string()),
          missing: v.array(v.string()),
        }),
      ),
    ),
    eveSessionId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_match", ["userId", "matchPercentage"]),

  rateLimits: defineTable({
    userId: v.id("users"),
    date: v.string(),
    analysisCount: v.number(),
  }).index("by_user_date", ["userId", "date"]),
})
