import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "LFP Monad",
  description: "Lost Feet Pics on Monad.",
  openGraph: {
    type: "website",
    title: "LFP Monad",
    description: "Lost Feet Pics on Monad.",
    images: ["/logo.png"],
    url: "https://lfp-monad.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "LFP Monad",
    description: "Lost Feet Pics on Monad.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "400x400", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/gagalin" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}