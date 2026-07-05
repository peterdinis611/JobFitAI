"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react"
import { Briefcase, BookOpen, FileText, History, Kanban, LogOut } from "lucide-react"
import { motion } from "motion/react"
import { AuthScreen } from "@/components/auth/auth-screen"
import { RobotLogo, RobotLogoMark } from "@/components/brand/robot-logo"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "History", icon: History },
  { href: "/tracker", label: "Tracker", icon: Kanban },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/analyze", label: "Analyze", icon: Briefcase },
  { href: "/docs", label: "Docs", icon: BookOpen, static: true },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { signOut } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { email } = useJobFitUser()

  if (isLoading) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <RobotLogo size={44} />
          <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full w-1/2 rounded-full bg-primary"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <div className="flex min-h-dvh flex-col text-foreground">
      <header className="mac-toolbar sticky top-0 z-40">
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          >
            <RobotLogoMark />
            <span className="hidden text-[15px] sm:inline">JobFit AI</span>
          </Link>

          <nav className="mac-segmented hidden overflow-x-auto sm:flex">
            {links.map(({ href, label, icon: Icon, static: isStatic }) => {
              const active =
                href.startsWith("/docs") ? pathname.startsWith("/docs") : pathname === href
              const className = cn(
                "mac-segmented-item whitespace-nowrap",
                active && "mac-segmented-item-active",
              )
              const inner = (
                <>
                  <Icon className="size-3.5 shrink-0 opacity-80" strokeWidth={2.25} />
                  <span>{label}</span>
                </>
              )
              return isStatic ? (
                <a key={href} href={href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link key={href} href={href} className={className}>
                  {inner}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {email ? (
              <span className="mr-1 hidden max-w-[120px] truncate text-[11px] text-muted-foreground lg:inline">
                {email}
              </span>
            ) : null}
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" aria-label="Sign out" onClick={() => void signOut()}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 sm:hidden">
          {links.map(({ href, label, icon: Icon, static: isStatic }) => {
            const active =
              href.startsWith("/docs") ? pathname.startsWith("/docs") : pathname === href
            const className = cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )
            const inner = (
              <>
                <Icon className="size-3.5" />
                {label}
              </>
            )
            return isStatic ? (
              <a key={href} href={href} className={className}>
                {inner}
              </a>
            ) : (
              <Link key={href} href={href} className={className}>
                {inner}
              </Link>
            )
          })}
        </div>
      </header>

      <motion.main
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        key={pathname}
      >
        {children}
      </motion.main>
    </div>
  )
}
