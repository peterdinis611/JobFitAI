import { z } from "zod"

export const seniorityFitSchema = z.enum(["under", "match", "over"])

export const skillCategorySchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  matched: z.array(z.string()),
  missing: z.array(z.string()),
})

export const parseResumeInputSchema = z.object({
  userId: z.string().min(1),
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
  url: z
    .string()
    .url()
    .max(2048)
    .refine((u) => u.startsWith("https://"), {
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

/** Empty / null IDs become undefined at the call site via `normalizeOptionalId`. */
const optionalId = z.union([z.string(), z.null()]).optional()

/** Strip blank optional IDs before Convex writes (agents often send ""). */
export function normalizeOptionalId(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/** Lenient schema — agents often omit fields or send empty strings. */
export const saveAnalysisInputSchema = z.object({
  userId: z.string().min(1),
  resumeId: z.string().min(1),
  jobPostingId: z.string().min(1),
  matchPercentage: z.coerce.number().min(0).max(100),
  matchingSkills: z.array(z.string()).catch([]),
  missingSkills: z.array(z.string()).catch([]),
  seniorityFit: seniorityFitSchema.catch("match"),
  redFlags: z.array(z.string()).catch([]),
  recommendations: z.array(z.string()).catch([]),
  skillCategories: z.array(skillCategorySchema).optional().catch([]),
  eveSessionId: optionalId,
  previousAnalysisId: optionalId,
})

export const saveAnalysisOutputSchema = z.object({
  analysisId: z.string(),
})

export const updateJobPostingInputSchema = z.object({
  userId: z.string().min(1),
  jobPostingId: z.string().min(1),
  title: z.string().optional(),
  cleanedText: z.string().min(1),
})

export const updateJobPostingOutputSchema = z.object({
  jobPostingId: z.string(),
  title: z.string().optional(),
})

export const loadJobPostingInputSchema = z.object({
  userId: z.string().min(1),
  jobPostingId: z.string().min(1),
})

export const loadJobPostingOutputSchema = z.object({
  jobPostingId: z.string(),
  source: z.enum(["text", "url"]),
  title: z.string().optional(),
  cleanedText: z.string().min(1),
  url: z.string().optional(),
  wordCount: z.number().int().nonnegative(),
})

export const tailoredBulletSchema = z.object({
  original: z.string(),
  rewritten: z.string(),
  rationale: z.string().optional(),
})

export const tailorBulletsInputSchema = z.object({
  resumeText: z.string().min(50),
  jobText: z.string().min(50),
  jobTitle: z.string().optional(),
  missingSkills: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
})

export const tailorBulletsOutputSchema = z.object({
  bullets: z.array(tailoredBulletSchema).min(3).max(5),
})

export const coverLetterInputSchema = z.object({
  resumeText: z.string().min(50),
  jobText: z.string().min(50),
  jobTitle: z.string().optional(),
  matchPercentage: z.number(),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  seniorityFit: seniorityFitSchema,
})

export const coverLetterOutputSchema = z.object({
  coverLetter: z.string().min(100),
})

export const learningPlanInputSchema = z.object({
  missingSkills: z.array(z.string()).min(1),
  jobTitle: z.string().optional(),
  seniorityFit: seniorityFitSchema.optional(),
})

export const learningPlanItemSchema = z.object({
  skill: z.string(),
  durationWeeks: z.number().int().min(1).max(4),
  steps: z.array(z.string()).min(2),
})

export const learningPlanOutputSchema = z.object({
  plans: z.array(learningPlanItemSchema).min(1),
})

export const saveArtifactInputSchema = z.object({
  userId: z.string().min(1),
  analysisId: z.string().min(1),
  type: z.enum(["tailored_bullets", "cover_letter", "learning_plan"]),
  content: z.unknown(),
})

export const saveArtifactOutputSchema = z.object({
  artifactId: z.string(),
})

export type ParseResumeInput = z.infer<typeof parseResumeInputSchema>
export type ParseResumeOutput = z.infer<typeof parseResumeOutputSchema>
export type FetchJobPostingInput = z.infer<typeof fetchJobPostingInputSchema>
export type FetchJobPostingOutput = z.infer<typeof fetchJobPostingOutputSchema>
export type ScoreMatchInput = z.infer<typeof scoreMatchInputSchema>
export type ScoreMatchOutput = z.infer<typeof scoreMatchOutputSchema>
export type SaveAnalysisInput = z.infer<typeof saveAnalysisInputSchema>
export type SaveAnalysisOutput = z.infer<typeof saveAnalysisOutputSchema>
