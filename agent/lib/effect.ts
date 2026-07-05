import { Effect, Duration, Schedule } from "effect"
import { runPromise } from "effect/Effect"

export const defaultRetry = Schedule.intersect(
  Schedule.recurs(2),
  Schedule.exponential(Duration.millis(300)),
)

export const networkTimeout = Duration.seconds(30)
export const parseTimeout = Duration.seconds(45)

export function runEffect<A, E>(effect: Effect.Effect<A, E, never>): Promise<A> {
  return runPromise(effect)
}
