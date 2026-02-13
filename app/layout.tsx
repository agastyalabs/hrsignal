import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { FloatingShortlistCta } from "@/components/marketing/FloatingShortlistCta";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hrsignal.vercel.app"),
  title: "HRSignal — India-first HR software recommendations",
  description:
    "Get explainable recommendations for HRMS, payroll & compliance, attendance, ATS, and performance tools. Shortlist fast and request pricing/demos without vendor spam.",
  icons: {
    icon: [
      { url: "/assets/logos/hrsignal-favicon-v2.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "HRSignal — India-first HR software recommendations",
    description:
      "Get explainable recommendations for HRMS, payroll & compliance, attendance, ATS, and performance tools.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HRSignal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HRSignal",
    url: "https://hrsignal.vercel.app",
    logo: "https://hrsignal.vercel.app/brand/hrsignal-logo.svg",
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@hrsignal.in",
      },
    ],
  };

  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <FloatingShortlistCta />
        <Analytics />
      </body>
    </html>
  );
}
