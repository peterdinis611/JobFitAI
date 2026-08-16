import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"
import { AuthRouteShell } from "@/components/auth/auth-route-shell"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Create account",
  description:
    "Create a free JobFit AI account to match resumes to roles, close skill gaps, and track applications.",
  path: "/sign-up",
})

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
