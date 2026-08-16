import { Bricolage_Grotesque, JetBrains_Mono, Literata } from "next/font/google"

/** Auth landing typography — scoped, not app-wide. */
export const authDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-auth-display",
  display: "swap",
})

export const authBody = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-auth-body",
  display: "swap",
})

export const authMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-auth-mono",
  display: "swap",
})

export const authFontVariables = `${authDisplay.variable} ${authBody.variable} ${authMono.variable}`
