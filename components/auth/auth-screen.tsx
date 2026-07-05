"use client"

import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { motion } from "motion/react"
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { AuthHeroIllustration } from "@/components/illustrations/jobfit-illustrations"
import { RobotLogoMark } from "@/components/brand/robot-logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

function friendlyAuthError(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Authentication failed"
  if (raw.includes("backfilling")) {
    return "Auth is still initializing — wait a few seconds and try again."
  }
  if (raw.includes("Invalid password")) return "Password must be at least 8 characters."
  if (raw.includes("already exists") || raw.includes("AccountAlreadyExists")) {
    return "An account with this email already exists. Try signing in."
  }
  if (raw.includes("InvalidAccountId") || raw.includes("Invalid credentials")) {
    return "Incorrect email or password."
  }
  const cleaned = raw.replace(/\[CONVEX[^\]]*\]\s*/g, "").split("\n")[0]?.trim()
  return cleaned && cleaned.length < 120 ? cleaned : "Authentication failed. Please try again."
}

export function AuthScreen() {
  const { signIn } = useAuthActions()
  const [step, setStep] = useState<"signIn" | "signUp">("signIn")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    formData.set("flow", step)

    try {
      await signIn("password", formData)
      toast.success(step === "signIn" ? "Welcome back" : "Account created")
    } catch (e) {
      const message = friendlyAuthError(e)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        className="mac-window w-full max-w-[420px]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mac-titlebar">
          <div className="mac-traffic-lights" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <span className="flex-1 text-center text-[13px] font-medium text-muted-foreground">
            JobFit AI
          </span>
          <div className="w-[52px]" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <RobotLogoMark />
            <h1 className="mac-large-title mt-4">
              {step === "signIn" ? "Sign In" : "Create Account"}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {step === "signIn"
                ? "Enter your email and password to continue"
                : "Start matching your resume to any role"}
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@icloud.com"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={step === "signIn" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="pl-9"
                />
              </div>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-[13px]">{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {step === "signIn" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-muted-foreground">
            {step === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className={cn("font-medium text-primary hover:underline")}
              onClick={() => {
                setError(null)
                setStep(step === "signIn" ? "signUp" : "signIn")
              }}
            >
              {step === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 hidden opacity-40 lg:block">
        <AuthHeroIllustration className="max-h-32" />
      </div>
    </div>
  )
}
