import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to JobFit AI to analyze resumes, track applications, and improve job fit.",
  alternates: { canonical: "/sign-in" },
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" signUpUrl="/sign-up" />
    </div>
  )
}
