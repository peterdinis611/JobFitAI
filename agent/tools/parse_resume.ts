import { defineTool } from "eve/tools"
import { Effect } from "effect"
import { api } from "../../convex/_generated/api.js"
import {
  parseResumeInputSchema,
  parseResumeOutputSchema,
} from "../../lib/schemas/tools"
import { convexMutation, convexQuery } from "#lib/convex"
import { runEffect, parseTimeout } from "#lib/effect"
import { extractTextFromBuffer, wordCount } from "#lib/parse-document"
import { ConvexError } from "#lib/errors"
import type { Id } from "../../convex/_generated/dataModel"

export default defineTool({
  description:
    "Load a resume from Convex storage and extract plain text from PDF or DOCX.",
  inputSchema: parseResumeInputSchema,
  async execute({ userId, resumeId }) {
    const program = Effect.gen(function* () {
      const resume = yield* Effect.tryPromise({
        try: () =>
          convexQuery(api.resumes.getForAgent, {
            userId: userId as Id<"users">,
            resumeId: resumeId as Id<"resumes">,
          }),
        catch: (error) =>
          new ConvexError({
            message: error instanceof Error ? error.message : "Convex query failed",
          }),
      })

      if (!resume) {
        return yield* Effect.fail(new ConvexError({ message: "Resume not found" }))
      }

      if (resume.parsedText && resume.parsedText.length > 50) {
        return {
          resumeId,
          fileName: resume.fileName,
          mimeType: resume.mimeType,
          parsedText: resume.parsedText,
          wordCount: wordCount(resume.parsedText),
        }
      }

      const fileUrl = yield* Effect.tryPromise({
        try: () =>
          convexQuery(api.resumes.getFileUrlForAgent, {
            userId: userId as Id<"users">,
            resumeId: resumeId as Id<"resumes">,
          }),
        catch: (error) =>
          new ConvexError({
            message: error instanceof Error ? error.message : "Could not resolve file URL",
          }),
      })

      if (!fileUrl) {
        return yield* Effect.fail(new ConvexError({ message: "Resume file missing in storage" }))
      }

      const buffer = yield* Effect.tryPromise({
        try: async () => {
          const res = await fetch(fileUrl)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return Buffer.from(await res.arrayBuffer())
        },
        catch: (error) =>
          new ConvexError({
            message: error instanceof Error ? error.message : "Failed to download resume",
          }),
      })

      const parsedText = yield* extractTextFromBuffer(buffer, resume.mimeType, resume.fileName)

      yield* Effect.tryPromise({
        try: () =>
          convexMutation(api.resumes.updateParsedTextForAgent, {
            userId: userId as Id<"users">,
            resumeId: resume._id,
            parsedText,
          }),
        catch: () => undefined,
      })

      return {
        resumeId,
        fileName: resume.fileName,
        mimeType: resume.mimeType,
        parsedText,
        wordCount: wordCount(parsedText),
      }
    }).pipe(Effect.timeout(parseTimeout))

    const result = await runEffect(program)
    return parseResumeOutputSchema.parse(result)
  },
})
