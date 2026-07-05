import { Effect } from "effect"
import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"
import { ParsingError } from "#lib/errors"

export function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Effect.Effect<string, ParsingError> {
  return Effect.tryPromise({
    try: async () => {
      if (mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
        const parser = new PDFParse({ data: buffer })
        try {
          const result = await parser.getText()
          return result.text.trim()
        } finally {
          await parser.destroy()
        }
      }

      if (
        mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.toLowerCase().endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer })
        return result.value.trim()
      }

      throw new ParsingError({
        message: `Unsupported file type: ${mimeType || fileName}`,
      })
    },
    catch: (error) =>
      error instanceof ParsingError
        ? error
        : new ParsingError({
            message: error instanceof Error ? error.message : "Failed to parse document",
          }),
  }).pipe(
    Effect.flatMap((text) =>
      text.length < 20
        ? Effect.fail(new ParsingError({ message: "Extracted text is too short to analyze" }))
        : Effect.succeed(text),
    ),
  )
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}
