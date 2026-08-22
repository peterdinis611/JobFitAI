"use client"

import { SignOutButton, UserButton, useAuth } from "@clerk/nextjs"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { BookOpen, Briefcase, FileText, GitCompare, History, Kanban } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthScreen } from "@/components/auth/auth-screen"
import { RobotLogoMark } from "@/components/brand/robot-logo"
import { ShellLoading } from "@/components/brand/shell-loading"
import { FollowUpBell } from "@/components/layout/follow-up-bell"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { cn } from "@/lib/utils"

const links = [
  {
    href: "/",
    label: "History",
    icon: History,
    match: (p: string) => p === "/" || p.startsWith("/analyses/"),
  },
  {
    href: "/compare",
    label: "Compare",
    icon: GitCompare,
    match: (p: string) => p.startsWith("/compare"),
  },
  {
    href: "/tracker",
    label: "Tracker",
    icon: Kanban,
    match: (p: string) => p.startsWith("/tracker"),
  },
  {
    href: "/resumes",
    label: "Resumes",
    icon: FileText,
    match: (p: string) => p.startsWith("/resumes"),
  },
  {
    href: "/analyze",
    label: "Analyze",
    icon: Briefcase,
    match: (p: string) => p.startsWith("/analyze"),
  },
  {
    href: "/docs",
    label: "Docs",
    icon: BookOpen,
    static: true,
    match: (p: string) => p.startsWith("/docs"),
  },
]

function ShellLoadingGate() {
  return <ShellLoading label="Syncing session" />
}

/** Clerk session exists but Convex rejected the JWT (missing Convex integration / template). */
function ConvexAuthMismatch() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <section
        className="mac-window w-full max-w-md overflow-hidden"
        aria-labelledby="auth-mismatch-title"
      >
        <header className="border-b border-border bg-[var(--mac-titlebar)] px-5 py-4">
          <div className="flex items-center gap-3">
            <RobotLogoMark />
            <div>
              <h1 id="auth-mismatch-title" className="text-[17px] font-semibold tracking-tight">
                Almost there
              </h1>
              <p className="text-xs text-muted-foreground">Clerk is signed in · Convex is not</p>
            </div>
          </div>
        </header>
        <div className="space-y-4 px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Activate the{" "}
            <a
              className="font-medium text-primary underline-offset-2 hover:underline"
              href="https://dashboard.clerk.com/apps/setup/convex"
              target="_blank"
              rel="noreferrer"
            >
              Clerk → Convex integration
            </a>
            , then sign out and sign back in so a fresh JWT is issued.
          </p>
          <p className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <a
              href="https://dashboard.clerk.com/apps/setup/convex"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground"
            >
              Open Clerk Convex setup
            </a>
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-lg border border-border bg-card px-4 text-[13px] font-medium shadow-sm hover:bg-accent"
              >
                Sign out and retry
              </button>
            </SignOutButton>
          </p>
        </div>
      </section>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isLoaded, isSignedIn } = useAuth()
  const isClerkAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")

  if (isClerkAuthRoute) {
    return <>{children}</>
  }

  if (!isLoaded) {
    return <ShellLoadingGate />
  }

  if (!isSignedIn) {
    return <AuthScreen />
  }

  return (
    <>
      <AuthLoading>
        <ShellLoadingGate />
      </AuthLoading>

      <Unauthenticated>
        <ConvexAuthMismatch />
      </Unauthenticated>

      <Authenticated>
        <AuthenticatedShell pathname={pathname}>{children}</AuthenticatedShell>
      </Authenticated>
    </>
  )
}

function AuthenticatedShell({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname: string
}) {
  const { email } = useJobFitUser()

  return (
    <div className="flex min-h-dvh flex-col text-foreground">
      <header className="mac-toolbar sticky top-0 z-40">
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <RobotLogoMark />
            <span className="hidden text-[15px] sm:inline">JobFit AI</span>
          </Link>

          <nav className="mac-segmented hidden overflow-x-auto sm:flex" aria-label="Primary">
            {links.map(({ href, label, icon: Icon, static: isStatic, match }) => {
              const active = match(pathname)
              const className = cn(
                "mac-segmented-item whitespace-nowrap",
                active && "mac-segmented-item-active",
              )
              const inner = (
                <>
                  <Icon className="size-3.5 shrink-0 opacity-80" strokeWidth={2.25} aria-hidden />
                  <span>{label}</span>
                </>
              )
              return isStatic ? (
                <a key={href} href={href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  {inner}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {email ? (
              <span className="mr-1 hidden max-w-[120px] truncate text-[11px] text-muted-foreground lg:inline">
                {email}
              </span>
            ) : null}
            <FollowUpBell />
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8",
                },
              }}
            />
          </div>
        </div>

        <nav
          className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 sm:hidden"
          aria-label="Primary mobile"
        >
          {links.map(({ href, label, icon: Icon, static: isStatic, match }) => {
            const active = match(pathname)
            const className = cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )
            const inner = (
              <>
                <Icon className="size-3.5" aria-hidden />
                {label}
              </>
            )
            return isStatic ? (
              <a key={href} href={href} className={className}>
                {inner}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {inner}
              </Link>
            )
          })}
        </nav>
      </header>

      <main
        className="shell-page mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-6"
        key={pathname}
      >
        {children}
      </main>
    </div>
  )
}
