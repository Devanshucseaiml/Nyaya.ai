import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { I18nProvider } from "@/lib/i18n/context" // Added i18n provider import
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import "./globals.css"
import { Manrope } from "next/font/google"
const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nyaya.ai - Legal AI Assistant",
  description: "AI-powered legal assistant specializing in Indian law",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://js.puter.com/v2/" async />
      </head>
      <body className={`${manrope.className} antialiased`} suppressHydrationWarning>
        <I18nProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem 
            disableTransitionOnChange
          >
            <Header />
            <main className="pt-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
