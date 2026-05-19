import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

// ─── SEO Metadata ────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Trace | Sustainability Tracker",
    template: "%s | Trace",
  },
  description:
    "Trace helps Indian SME manufacturers log resource consumption, track sustainability metrics, and generate professional report cards — batch by batch.",
  keywords: [
    "sustainability",
    "manufacturing",
    "SME",
    "India",
    "resource tracking",
    "green factory",
    "ESG reporting",
  ],
  authors: [{ name: "Trace Team" }],
  creator: "Trace",
  metadataBase: new URL("https://trace.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Trace",
    title: "Trace | Sustainability Tracker for Indian Manufacturers",
    description:
      "Log production batch resource usage and generate sustainability report cards.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── Viewport ────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,       // allow user pinch-zoom for accessibility
  themeColor: "#1a6b3a",
};

// ─── Root Layout ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
