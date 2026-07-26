import type { EveMessage } from "eve/react"
import { describe, expect, it } from "vitest"
import { parseAnalysisStream } from "./analyze-stream"

function assistant(parts: EveMessage["parts"]): EveMessage {
  return { id: "m1", role: "assistant", parts } as EveMessage
}

describe("parseAnalysisStream", () => {
  it("returns empty idle state", () => {
    const state = parseAnalysisStream([])
    expect(state.hasStarted).toBe(false)
    expect(state.steps).toEqual([])
    expect(state.allDone).toBe(false)
  })

  it("tracks tool steps and extracts save + score outputs", () => {
    const state = parseAnalysisStream([
      assistant([
        { type: "text", text: " Scoring… " },
        {
          type: "dynamic-tool",
          toolName: "parse_resume",
          state: "output-available",
          output: {},
        } as never,
        {
          type: "dynamic-tool",
          toolName: "score_match",
          state: "output-available",
          output: { matchPercentage: 88 },
        } as never,
        {
          type: "dynamic-tool",
          toolName: "save_analysis",
          state: "output-available",
          output: { analysisId: "a123" },
        } as never,
      ]),
    ])

    expect(state.hasStarted).toBe(true)
    expect(state.allDone).toBe(true)
    expect(state.isRunning).toBe(false)
    expect(state.hasError).toBe(false)
    expect(state.matchPercentage).toBe(88)
    expect(state.analysisId).toBe("a123")
    expect(state.assistantText).toBe("Scoring…")
    expect(state.steps.map((s) => s.id)).toEqual(["parse_resume", "score_match", "save_analysis"])
  })

  it("marks errors and running states", () => {
    const state = parseAnalysisStream([
      assistant([
        {
          type: "dynamic-tool",
          toolName: "parse_resume",
          state: "output-error",
          errorText: "boom",
        } as never,
        {
          type: "dynamic-tool",
          toolName: "score_match",
          state: "input-available",
        } as never,
      ]),
    ])

    expect(state.hasError).toBe(true)
    expect(state.isRunning).toBe(true)
    expect(state.failedStep?.id).toBe("parse_resume")
    expect(state.failedStep?.error).toBe("boom")
  })

  it("parses analysisId from nested or string output", () => {
    const nested = parseAnalysisStream([
      assistant([
        {
          type: "dynamic-tool",
          toolName: "save_analysis",
          state: "output-available",
          output: { value: { analysisId: "nested_id" } },
        } as never,
      ]),
    ])
    expect(nested.analysisId).toBe("nested_id")

    const asString = parseAnalysisStream([
      assistant([
        {
          type: "dynamic-tool",
          toolName: "save_analysis",
          state: "output-available",
          output: JSON.stringify({ analysisId: "str_id" }),
        } as never,
      ]),
    ])
    expect(asString.analysisId).toBe("str_id")
  })
})
