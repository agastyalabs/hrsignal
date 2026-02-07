import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    icon: "/favicon.ico",
    apple: "/logo.png",
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
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
