import type { Metadata } from "next";
import { Playfair_Display, Lora, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://theladybookhouse.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lady Bookhouse — Curated Used Books",
    template: "%s · Lady Bookhouse",
  },
  description:
    "A warm, independent online bookshop — curated books with care, shipped with love.",
  openGraph: {
    type: "website",
    siteName: "Lady Bookhouse",
    title: "Lady Bookhouse — Curated Used Books",
    description:
      "A warm, independent online bookshop — curated books with care, shipped with love.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Lady Bookhouse",
    description:
      "A warm, independent online bookshop — curated books with care, shipped with love.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          playfair.variable,
          lora.variable,
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
