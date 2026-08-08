import type { Metadata, Viewport } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://westmonks.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Westmonks — Shopify Automation & AI Operations",
    template: "%s | Westmonks",
  },
  description:
    "Backend-Automatisierungen und KI-Systeme für wachsende Shopify-Stores: Rechnungen, Bestand, Support und Fulfillment ohne manuelles Chaos.",
  keywords: [
    "Shopify Automatisierung",
    "Shopify Backend Automation",
    "Shopify Lexoffice",
    "Shopify sevDesk",
    "AI Kundenservice",
    "Make.com Shopify",
    "Zapier Shopify",
    "E-Commerce Operations",
  ],
  openGraph: {
    title: "Westmonks — Shopify Automation & AI Operations",
    description:
      "Wir beseitigen manuelles Chaos in Shopify-Stores durch intelligente Backend-Automatisierungen und KI-Workflows.",
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Westmonks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westmonks — Shopify Automation & AI Operations",
    description:
      "Rechnungen, Bestand, Support und Fulfillment — automatisiert statt manuell.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
