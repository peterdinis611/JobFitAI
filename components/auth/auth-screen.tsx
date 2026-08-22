"use client"

import dynamic from "next/dynamic"
import { AuthAtmosphere } from "@/components/auth/auth-atmosphere"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { AuthFooter, AuthHowItWorks } from "@/components/auth/auth-landing-sections"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const MatchDial = dynamic(() => import("@/components/auth/match-dial").then((m) => m.MatchDial), {
  ssr: false,
  loading: () => (
    <div
      className="mx-auto aspect-square w-full max-w-[380px] animate-pulse rounded-full bg-[color-mix(in_srgb,var(--auth-fg)_6%,transparent)]"
      aria-hidden
    />
  ),
})

export function AuthScreen() {
  return (
    <div className={cn("auth-deck relative text-[var(--auth-fg)]", authFontVariables)}>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <AuthAtmosphere />
      </div>

      <div className="fixed top-6 right-6 z-30 sm:top-8 sm:right-8">
        <div className="rounded-md border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_70%,transparent)] p-1 backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>

      <p
        aria-hidden
        className="auth-fade-in pointer-events-none fixed top-1/2 left-3 z-10 hidden origin-left -translate-y-1/2 -rotate-90 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.45em] text-[var(--auth-muted)] uppercase md:block"
      >
        Resume · Role · Signal
      </p>

      <section
        aria-labelledby="auth-hero-title"
        className="relative z-10 mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:py-12"
      >
        <div className="auth-hero-copy relative">
          <p className="mb-5 font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-[var(--auth-accent)] uppercase">
            Career intelligence · Instrument 01
          </p>

          <div className="relative">
            <h1
              id="auth-hero-title"
              className="font-[family-name:var(--font-auth-display)] text-[clamp(3.4rem,11vw,7.5rem)] leading-[0.82] font-extrabold tracking-[-0.055em]"
            >
              JobFit
              <span className="block text-[var(--auth-accent)]">AI</span>
            </h1>

            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-4 hidden select-none font-[family-name:var(--font-auth-display)] text-[7rem] leading-none font-extrabold tracking-[-0.08em] text-[var(--auth-fg)] opacity-[0.04] lg:block xl:text-[9rem]"
            >
              MATCH
            </span>
          </div>

          <p className="mt-8 max-w-md font-[family-name:var(--font-auth-body)] text-[clamp(1.2rem,2.4vw,1.55rem)] leading-snug font-medium tracking-[-0.015em] text-[var(--auth-fg)]">
            Match your resume to any role.
          </p>

          <p className="mt-4 max-w-sm font-[family-name:var(--font-auth-body)] text-[16px] leading-relaxed text-[var(--auth-muted)]">
            Calibrate fit, expose skill gaps, and track applications — a quiet instrument for noisy
            job markets.
          </p>

          <p className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <a
              href="/sign-in"
              className="auth-btn-primary group relative h-13 flex-1 overflow-hidden"
            >
              <span className="relative z-10">Sign in</span>
              <span className="absolute inset-0 translate-x-[-110%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-[110%]" />
            </a>
            <a href="/sign-up" className="auth-btn-secondary h-13 flex-1">
              Create account
            </a>
          </p>

          <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.2em] text-[var(--auth-muted)] uppercase">
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
          </p>
        </div>

        <aside className="auth-hero-dial relative" aria-label="Sample fit index dial">
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--auth-accent)_12%,transparent),transparent_70%)]" />
          <MatchDial className="relative z-10" />
          <p className="mt-4 text-center font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase">
            Example readout — your score after analysis
          </p>
        </aside>

        <a
          href="#how-it-works"
          className="auth-scroll-hint absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase transition-colors hover:text-[var(--auth-accent)] md:inline-flex lg:bottom-8"
        >
          Scroll · How it works
        </a>
      </section>

      <AuthHowItWorks />
      <AuthFooter />
    </div>
  )
}
