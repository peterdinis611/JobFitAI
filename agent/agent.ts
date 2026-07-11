import { defineAgent } from "eve";
import { agentModel } from "./lib/model";

export default defineAgent({
  model: agentModel,
});
