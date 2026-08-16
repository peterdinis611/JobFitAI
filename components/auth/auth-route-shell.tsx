import type { ReactNode } from "react"
import { AuthAtmosphere } from "@/components/auth/auth-atmosphere"
import { authFontVariables } from "@/components/auth/auth-fonts"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

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
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <AuthAtmosphere />
      </div>

      <div className="absolute top-8 right-8 z-30">
        <div className="rounded-md border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_70%,transparent)] p-1 backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4 py-16">
        <header className="auth-hero-copy flex w-full flex-col items-start">
          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.32em] text-[var(--auth-accent)] uppercase">
            JobFit AI
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-auth-display)] text-4xl leading-none font-extrabold tracking-[-0.05em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-sm font-[family-name:var(--font-auth-body)] text-sm leading-relaxed text-[var(--auth-muted)]">
            {subtitle}
          </p>
        </header>

        <div className="auth-clerk-panel auth-fade-in w-full">{children}</div>
      </div>
    </div>
  )
}
