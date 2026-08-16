import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a JobFit AI account to match resumes to roles and track your applications.",
  alternates: { canonical: "/sign-up" },
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" signInUrl="/sign-in" />
    </div>
  )
}
