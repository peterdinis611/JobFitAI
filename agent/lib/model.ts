import { openai } from "@ai-sdk/openai"

/** Shared LLM for agent chat and structured tool outputs. */
export const agentModel = openai("gpt-4.1")
