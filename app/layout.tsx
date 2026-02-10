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
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
