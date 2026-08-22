#!/usr/bin/env node
/**
 * Mirror .cursor/skills → .claude/skills and jobfit-* → .agents/skills
 * Run after adding or editing project agent skills.
 */
import { cpSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const cursorSkills = join(root, ".cursor/skills")
const claudeSkills = join(root, ".claude/skills")
const agentsSkills = join(root, ".agents/skills")

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true, force: true })
}

copyDir(cursorSkills, claudeSkills)

for (const name of readdirSync(cursorSkills)) {
  if (!name.startsWith("jobfit")) continue
  copyDir(join(cursorSkills, name), join(agentsSkills, name))
}

console.log("Synced skills:")
console.log("  .cursor/skills → .claude/skills")
console.log("  jobfit-* → .agents/skills")
