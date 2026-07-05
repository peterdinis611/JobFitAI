"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, History, Moon, Sparkles, Sun } from "lucide-react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "History", icon: History },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/analyze", label: "Analyze", icon: Briefcase },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-dvh text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
            <motion.span
              className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Sparkles className="size-4" />
            </motion.span>
            <span>
              JobFit <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-300">AI</span>
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
            <Button
              variant="ghost"
              size="icon"
              className="relative ml-1"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="size-4 scale-100 dark:scale-0" />
              <Moon className="absolute size-4 scale-0 dark:scale-100" />
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
