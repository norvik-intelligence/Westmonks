import type { Metadata, Viewport } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://westmonks.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Westmonks — Shopify Operations & Automation",
    template: "%s | Westmonks",
  },
  description:
    "Maßgeschneiderte Backend-Automatisierungen für wachsende Shopify-Stores: Rechnungen, Bestand, Support und Fulfillment ohne manuelles Chaos.",
  keywords: [
    "Shopify Automatisierung",
    "Shopify Backend Automation",
    "Shopify Bestandsabgleich",
    "Shopify Kundenservice",
    "Shopify Fulfillment Automation",
    "E-Commerce Operations",
  ],
  openGraph: {
    title: "Westmonks — Shopify Operations & Automation",
    description:
      "Wir beseitigen manuelles Chaos in Shopify-Stores durch intelligente Backend-Automatisierungen und klare Operations-Systeme.",
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Westmonks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westmonks — Shopify Operations & Automation",
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
  themeColor: "#d8f4ff",
  colorScheme: "light",
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
