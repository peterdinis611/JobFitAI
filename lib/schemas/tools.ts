import { z } from "zod"

export const seniorityFitSchema = z.enum(["under", "match", "over"])

export const skillCategorySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  matched: z.array(z.string()),
  missing: z.array(z.string()),
})

export const parseResumeInputSchema = z.object({
  resumeId: z.string().min(1),
})

export const parseResumeOutputSchema = z.object({
  resumeId: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  parsedText: z.string(),
  wordCount: z.number().int().nonnegative(),
})

export const fetchJobPostingInputSchema = z.object({
  url: z.string().url().max(2048).refine((u) => u.startsWith("https://"), {
    message: "Only HTTPS URLs are allowed",
  }),
})

export const fetchJobPostingOutputSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  cleanedText: z.string().min(1),
  wordCount: z.number().int().nonnegative(),
})

export const scoreMatchInputSchema = z.object({
  resumeText: z.string().min(50),
  jobText: z.string().min(50),
  jobTitle: z.string().optional(),
})

export const scoreMatchOutputSchema = z.object({
  matchPercentage: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  seniorityFit: seniorityFitSchema,
  redFlags: z.array(z.string()),
  recommendations: z.array(z.string()),
  skillCategories: z.array(skillCategorySchema),
})

export const saveAnalysisInputSchema = scoreMatchOutputSchema.extend({
  userId: z.string().min(1),
  resumeId: z.string().min(1),
  jobPostingId: z.string().min(1),
  eveSessionId: z.string().optional(),
})

export const saveAnalysisOutputSchema = z.object({
  analysisId: z.string(),
})

export type ParseResumeInput = z.infer<typeof parseResumeInputSchema>
export type ParseResumeOutput = z.infer<typeof parseResumeOutputSchema>
export type FetchJobPostingInput = z.infer<typeof fetchJobPostingInputSchema>
export type FetchJobPostingOutput = z.infer<typeof fetchJobPostingOutputSchema>
export type ScoreMatchInput = z.infer<typeof scoreMatchInputSchema>
export type ScoreMatchOutput = z.infer<typeof scoreMatchOutputSchema>
export type SaveAnalysisInput = z.infer<typeof saveAnalysisInputSchema>
export type SaveAnalysisOutput = z.infer<typeof saveAnalysisOutputSchema>
