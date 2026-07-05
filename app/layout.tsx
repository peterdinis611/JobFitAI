import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import { AppThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: "JobFit AI",
  description: "AI-powered resume vs job posting match analysis",
}

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <AppThemeProvider>
            <TooltipProvider>
              <AppShell>{children}</AppShell>
              <Toaster />
            </TooltipProvider>
          </AppThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
