"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { RobotLogoMark } from "@/components/brand/robot-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function AuthScreen() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mac-window w-full max-w-md overflow-hidden">
        <div className="border-b border-border bg-[var(--mac-titlebar)] px-5 py-4">
          <div className="flex items-center gap-3">
            <RobotLogoMark />
            <div>
              <h1 className="text-[17px] font-semibold tracking-tight">JobFit AI</h1>
              <p className="text-xs text-muted-foreground">Match your resume to any role</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-8 text-center">
          <div className="space-y-2">
            <p className="text-[15px] font-medium">Sign in to continue</p>
            <p className="text-sm text-muted-foreground">
              Upload a CV, analyze job postings, and track applications.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <SignInButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
              <Button className="w-full sm:w-auto">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/" fallbackRedirectUrl="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Create account
              </Button>
            </SignUpButton>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Powered by Clerk · secure email, password, and social sign-in
          </p>
        </div>
      </div>
    </div>
  )
}
