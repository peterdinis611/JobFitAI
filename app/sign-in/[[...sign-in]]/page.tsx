import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"
import { AuthRouteShell } from "@/components/auth/auth-route-shell"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to JobFit AI to analyze resumes, track applications, and improve job fit.",
  alternates: { canonical: "/sign-in" },
}

export default function SignInPage() {
  return (
    <AuthRouteShell title="Welcome back" subtitle="Sign in to continue matching resumes to roles.">
      <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" signUpUrl="/sign-up" />
    </AuthRouteShell>
  )
}
