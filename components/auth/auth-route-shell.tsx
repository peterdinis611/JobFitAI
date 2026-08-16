"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { AuthAtmosphere } from "@/components/auth/auth-atmosphere"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

/** Shared ambient shell for Clerk hosted SignIn / SignUp pages. */
export function AuthRouteShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div
      className={cn(
        "auth-deck relative min-h-dvh overflow-hidden text-[var(--auth-fg)]",
        authFontVariables,
      )}
    >
      <AuthAtmosphere />

      <div className="absolute top-8 right-8 z-30">
        <div className="rounded-md border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_70%,transparent)] p-1 backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4 py-16">
        <motion.div
          className="flex w-full flex-col items-start"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.32em] text-[var(--auth-accent)] uppercase">
            JobFit AI
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-auth-display)] text-4xl leading-none font-extrabold tracking-[-0.05em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-sm font-[family-name:var(--font-auth-body)] text-sm leading-relaxed text-[var(--auth-muted)]">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="auth-clerk-panel w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
