"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"
import { ArrowLeft, Home, Sparkles } from "lucide-react"
import { RobotLogo } from "@/components/brand/robot-logo"
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion/motion-primitives"
import { Button } from "@/components/ui/button"
import { NotFoundIllustration } from "@/components/not-found/not-found-illustration"

const digitVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100dvh-52px)] flex-col items-center justify-center overflow-hidden px-4 py-12">
      <motion.div
        className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[12%] bottom-[18%] size-40 rounded-full bg-primary/6 blur-2xl"
        animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <FadeIn className="w-full max-w-lg">
        <div className="mac-window">
          <div className="mac-titlebar">
            <div className="mac-traffic-lights" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="flex flex-1 items-center justify-center gap-2 pr-[52px]">
              <RobotLogo size={18} animated />
              <span className="text-xs font-medium text-muted-foreground">JobFit AI — Finder</span>
            </div>
          </div>

          <div className="flex flex-col items-center px-6 py-8 text-center sm:px-10 sm:py-10">
            <NotFoundIllustration className="mb-2" />

            <div
              className="mt-2 flex items-baseline justify-center gap-1"
              style={{ perspective: "600px" }}
              aria-hidden
            >
              {"404".split("").map((digit, i) => (
                <motion.span
                  key={digit + i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={digitVariants}
                  className="mac-large-title text-[clamp(3rem,12vw,4.5rem)] leading-none text-primary"
                >
                  {digit}
                </motion.span>
              ))}
            </div>

            <StaggerList className="mt-4 flex w-full flex-col items-center">
              <StaggerItem>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  This page took a wrong turn
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  The URL you opened doesn&apos;t match any route in JobFit AI. Head back to your
                  dashboard or start a fresh resume analysis.
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild>
                    <Link href="/">
                      <Home className="size-4" />
                      Back to dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/analyze">
                      <Sparkles className="size-4" />
                      Run analysis
                    </Link>
                  </Button>
                </div>
              </StaggerItem>
              <StaggerItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-muted-foreground"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="size-3.5" />
                  Go back
                </Button>
              </StaggerItem>
            </StaggerList>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
