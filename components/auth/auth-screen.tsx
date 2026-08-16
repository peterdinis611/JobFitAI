"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { motion } from "motion/react"
import { AuthAtmosphere } from "@/components/auth/auth-atmosphere"
import { AuthBootOverlay } from "@/components/auth/auth-boot-overlay"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { AuthFooter, AuthHowItWorks } from "@/components/auth/auth-landing-sections"
import { MatchDial } from "@/components/auth/match-dial"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

export function AuthScreen() {
  return (
    <div className={cn("auth-deck relative text-[var(--auth-fg)]", authFontVariables)}>
      <AuthBootOverlay />

      <div className="pointer-events-none fixed inset-0 z-0">
        <AuthAtmosphere />
      </div>

      <div className="fixed top-6 right-6 z-30 sm:top-8 sm:right-8">
        <div className="rounded-md border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_70%,transparent)] p-1 backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>

      <a
        href="#how-it-works"
        className="fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase transition-colors hover:text-[var(--auth-accent)] md:inline-flex"
      >
        Scroll · How it works
      </a>

      <motion.p
        aria-hidden
        className="pointer-events-none fixed top-1/2 left-3 z-10 hidden origin-left -translate-y-1/2 -rotate-90 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.45em] text-[var(--auth-muted)] uppercase md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Resume · Role · Signal
      </motion.p>

      <section className="relative z-10 mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:py-12">
        <div className="relative">
          <motion.p
            className="mb-5 font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-[var(--auth-accent)] uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Career intelligence · Instrument 01
          </motion.p>

          <div className="relative">
            <motion.h1
              className="font-[family-name:var(--font-auth-display)] text-[clamp(3.4rem,11vw,7.5rem)] leading-[0.82] font-extrabold tracking-[-0.055em]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              JobFit
              <span className="block text-[var(--auth-accent)]">AI</span>
            </motion.h1>

            <motion.span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-4 hidden select-none font-[family-name:var(--font-auth-display)] text-[7rem] leading-none font-extrabold tracking-[-0.08em] text-[var(--auth-fg)] opacity-[0.04] lg:block xl:text-[9rem]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.04, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              MATCH
            </motion.span>
          </div>

          <motion.p
            className="mt-8 max-w-md font-[family-name:var(--font-auth-body)] text-[clamp(1.2rem,2.4vw,1.55rem)] leading-snug font-medium tracking-[-0.015em] text-[var(--auth-fg)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease }}
          >
            Match your resume to any role.
          </motion.p>

          <motion.p
            className="mt-4 max-w-sm font-[family-name:var(--font-auth-body)] text-[16px] leading-relaxed text-[var(--auth-muted)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5, ease }}
          >
            Calibrate fit, expose skill gaps, and track applications — a quiet instrument for noisy
            job markets.
          </motion.p>

          <motion.div
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5, ease }}
          >
            <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
              <button
                type="button"
                className="group relative h-13 flex-1 overflow-hidden rounded-md bg-[var(--auth-accent)] px-7 text-[15px] font-semibold tracking-[-0.01em] text-[#061018] transition-[transform,filter] hover:brightness-110 active:scale-[0.98]"
              >
                <span className="relative z-10">Sign in</span>
                <span className="absolute inset-0 translate-x-[-110%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-[110%]" />
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
              <button
                type="button"
                className="h-13 flex-1 rounded-md border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-fg)_4%,transparent)] px-7 text-[15px] font-semibold tracking-[-0.01em] text-[var(--auth-fg)] backdrop-blur-sm transition-colors hover:border-[var(--auth-accent)] hover:bg-[color-mix(in_srgb,var(--auth-accent)_10%,transparent)] active:scale-[0.98]"
              >
                Create account
              </button>
            </SignUpButton>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.2em] text-[var(--auth-muted)] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--auth-signal)]" />
              Live calibration
            </span>
            <a href="#how-it-works" className="transition-colors hover:text-[var(--auth-accent)]">
              How it works
            </a>
            <a href="/docs" className="transition-colors hover:text-[var(--auth-accent)]">
              Docs
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.94, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease }}
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--auth-accent)_12%,transparent),transparent_70%)]" />
          <MatchDial className="relative z-10" />
          <p className="mt-4 text-center font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase">
            Example readout — your score after analysis
          </p>
        </motion.div>
      </section>

      <AuthHowItWorks />
      <AuthFooter />
    </div>
  )
}
