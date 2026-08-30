import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "#lib": path.resolve(__dirname, "agent/lib"),
    },
  },
  test: {
    globals: false,
    passWithNoTests: false,
    projects: [
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "."),
            "#lib": path.resolve(__dirname, "agent/lib"),
          },
        },
        test: {
          name: "unit",
          environment: "node",
          include: ["__tests__/lib/**/*.test.ts", "__tests__/agent/**/*.test.ts"],
          exclude: ["node_modules", "website", ".next", "public"],
        },
      },
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "."),
          },
        },
        test: {
          name: "convex",
          environment: "edge-runtime",
          include: ["__tests__/convex/**/*.test.ts"],
          exclude: ["node_modules", "convex/_generated/**"],
        },
      },
    ],
  },
})
