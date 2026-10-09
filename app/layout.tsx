import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayoutWrapper } from "@/components/app-layout-wrapper"
import { cn } from "@/lib/utils"
import { RestaurantProvider } from "@/components/restaurant-provider"
import { AuthProvider } from "@/components/auth-provider"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-svh bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <RestaurantProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </RestaurantProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
