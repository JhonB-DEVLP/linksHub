import type React from "react";
import { inter, roboto_mono } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { scheduleWarmup } from "@/lib/cache-warmup";
import "./globals.css";

// Schedule cache warmup in production
if (process.env.NODE_ENV === "production") {
  if (typeof window === "undefined") {
    scheduleWarmup(30); // Every 30 minutes
  }
}

export const metadata = {
  title: "LinkHub - Open Source Link Management Platform",
  description: "A free, open-source platform for creating and managing personalized link pages",
  metadataBase: new URL("https://linkhub-production.vercel.app"),
  openGraph: {
    title: "LinkHub - Open Source Link Management Platform",
    description: "A free, open-source platform for creating and managing personalized link pages",
    url: "https://linkhub-production.vercel.app",
    siteName: "LinkHub",
    locale: "pt-BR",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto_mono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/link-dashboard-modern.png" as="image" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="linkhub-theme">
          <AuthProvider>
            <ThemeScript />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}