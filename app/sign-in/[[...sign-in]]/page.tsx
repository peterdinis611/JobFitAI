import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"
import { AuthRouteShell } from "@/components/auth/auth-route-shell"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description:
    "Sign in to JobFit AI to run resume match analyses, track applications, and export career reports.",
  path: "/sign-in",
})

export default function SignInPage() {
  return (
    <AuthRouteShell title="Welcome back" subtitle="Sign in to continue matching resumes to roles.">
      <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" signUpUrl="/sign-up" />
    </AuthRouteShell>
  )
}
