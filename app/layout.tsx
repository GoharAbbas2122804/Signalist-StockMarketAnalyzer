import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GuestSessionProvider } from "@/lib/context/GuestSessionContext";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://signalist.vercel.app'),
  title: {
    default: "Signalist - Real-time Stock Market Analyzer",
    template: "%s | Signalist"
  },
  description: "Track real-time stock prices, get personalized alerts, and explore detailed company insights with Signalist.",
  keywords: ["stock market", "finance", "investing", "real-time data", "portfolio tracker", "market analysis"],
  authors: [{ name: "Signalist Team" }],
  creator: "Signalist",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Signalist - Real-time Stock Market Analyzer",
    description: "Track real-time stock prices, get personalized alerts, and explore detailed company insights.",
    siteName: "Signalist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signalist - Real-time Stock Market Analyzer",
    description: "Track real-time stock prices, get personalized alerts, and explore detailed company insights.",
    creator: "@signalist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GuestSessionProvider>
          {children}
          <Toaster />
        </GuestSessionProvider>
      </body>
    </html>
  );
}
