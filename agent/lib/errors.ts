import { Data } from "effect"

export class ParsingError extends Data.TaggedError("ParsingError")<{
  readonly message: string
}> {}

export class FetchError extends Data.TaggedError("FetchError")<{
  readonly message: string
  readonly status?: number
}> {}

export class ConvexError extends Data.TaggedError("ConvexError")<{
  readonly message: string
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
}> {}
