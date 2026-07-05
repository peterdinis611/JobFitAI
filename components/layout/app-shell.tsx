"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react"
import { Briefcase, FileText, History, Kanban, LogOut } from "lucide-react"
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
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { signOut } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { email } = useJobFitUser()

  if (isLoading) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <RobotLogo size={40} />
          <motion.div
            className="h-1 w-12 overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              className="h-full w-1/2 rounded-full bg-primary"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-dvh text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-tight">
            <RobotLogoMark />
            <span>
              JobFit <span className="text-primary">AI</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                  <Icon className="relative size-4" />
                  <span className="relative hidden sm:inline">{label}</span>
                </Link>
              )
            })}
            {email ? (
              <span className="ml-2 hidden max-w-[140px] truncate text-xs text-muted-foreground md:inline">
                {email}
              </span>
            ) : null}
            <ThemeToggle className="ml-1" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              onClick={() => void signOut()}
            >
              <LogOut className="size-4" />
            </Button>
          </nav>
        </div>
      </header>
      <motion.main
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        key={pathname}
      >
        {children}
      </motion.main>
    </div>
  )
}
