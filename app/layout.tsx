import type { Metadata, Viewport } from "next";

import { site, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Shopify Operations & Automatisierung`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Shopify Operations & Automatisierung`,
    description:
      "Wir beseitigen manuelles Chaos in Shopify-Stores durch belastbare Backend-Systeme — inklusive der Sonderfälle, an denen fertige Apps aufhören.",
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Shopify Operations & Automatisierung`,
    description:
      "Rechnungen, Bestand, Support und Fulfillment — automatisiert statt manuell.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
