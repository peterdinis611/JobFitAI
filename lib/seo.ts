import type { Metadata } from "next"

/** Authenticated app surfaces — keep out of search indexes. */
export const privatePageRobots = {
  index: false,
  follow: false,
  nocache: true,
} as const satisfies NonNullable<Metadata["robots"]>

export const privatePageMetadata = {
  robots: privatePageRobots,
} as const satisfies Metadata
