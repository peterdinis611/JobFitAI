import { ConvexHttpClient } from "convex/browser"
import type { FunctionReference } from "convex/server"

let client: ConvexHttpClient | null = null

export function getConvexClient(): ConvexHttpClient {
  if (client) return client
  const url = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL
  if (!url) {
    throw new Error("CONVEX_URL or NEXT_PUBLIC_CONVEX_URL must be set")
  }
  client = new ConvexHttpClient(url)
  return client
}

export async function convexQuery<Query extends FunctionReference<"query">>(
  ref: Query,
  args: Query["_args"],
): Promise<Query["_returnType"]> {
  return getConvexClient().query(ref, args)
}

export async function convexMutation<Mutation extends FunctionReference<"mutation">>(
  ref: Mutation,
  args: Mutation["_args"],
): Promise<Mutation["_returnType"]> {
  return getConvexClient().mutation(ref, args)
}
