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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:grid-cols-2">
        <div className="relative hidden flex-col justify-center bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.15),transparent_55%)]" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2">
              <RobotLogoMark inverted />
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/75">
                JobFit AI
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary-foreground">
              Match your resume to any role
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Sign in to upload CVs, analyze job postings, and track your match scores over time.
            </p>
            <AuthHeroIllustration className="mt-8 opacity-95" />
          </motion.div>
        </div>

        <Card className="rounded-none border-0 bg-card shadow-none">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">
              {step === "signIn" ? "Sign in" : "Create account"}
            </CardTitle>
            <CardDescription>
              {step === "signIn"
                ? "Enter your email and password to continue"
                : "Start analyzing job matches in minutes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                  <AlertCircle />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {step === "signIn" ? "Sign in" : "Create account"}
                </Button>
              </motion.div>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {step === "signIn" ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                className={cn("font-medium text-primary hover:underline")}
                onClick={() => {
                  setError(null)
                  setStep(step === "signIn" ? "signUp" : "signIn")
                }}
              >
                {step === "signIn" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
