import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"
import { AuthRouteShell } from "@/components/auth/auth-route-shell"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a JobFit AI account to match resumes to roles and track your applications.",
  alternates: { canonical: "/sign-up" },
}

export default function SignUpPage() {
  return (
    <AuthRouteShell
      title="Create your account"
      subtitle="Start scoring job fit and tracking applications in minutes."
    >
      <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" signInUrl="/sign-in" />
    </AuthRouteShell>
  )
}
