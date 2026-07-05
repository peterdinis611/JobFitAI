import { defineSchema, defineTable } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { v } from "convex/values"

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    externalId: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_external_id", ["externalId"]),

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
    previousAnalysisId: v.optional(v.id("analyses")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_match", ["userId", "matchPercentage"])
    .index("by_previous", ["previousAnalysisId"]),

  applications: defineTable({
    userId: v.id("users"),
    analysisId: v.id("analyses"),
    status: v.union(
      v.literal("saved"),
      v.literal("applied"),
      v.literal("interview"),
      v.literal("offer"),
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_analysis", ["analysisId"]),

  artifacts: defineTable({
    userId: v.id("users"),
    analysisId: v.id("analyses"),
    type: v.union(
      v.literal("tailored_bullets"),
      v.literal("cover_letter"),
      v.literal("learning_plan"),
    ),
    content: v.any(),
    createdAt: v.number(),
  }).index("by_analysis_type", ["analysisId", "type"]),

  rateLimits: defineTable({
    userId: v.id("users"),
    date: v.string(),
    analysisCount: v.number(),
  }).index("by_user_date", ["userId", "date"]),
})
