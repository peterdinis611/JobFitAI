import { cpSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const src = join(root, "website/build")
const dest = join(root, "public/docs")

if (!existsSync(src)) {
  console.error("Missing website/build — run: npm run build --prefix website")
  process.exit(1)
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true })
}

cpSync(src, dest, { recursive: true })
console.log(`Copied Docusaurus build → public/docs`)
