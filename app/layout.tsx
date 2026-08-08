import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://westmonks.de"),
  title: {
    default: "Westmonks — Digitale Infrastruktur, die skaliert",
    template: "%s | Westmonks",
  },
  description:
    "High-End Webdesign, Shopify und AI-Automation für Energieanbieter, EV-Infrastruktur und ambitionierte Tech-Brands.",
  keywords: [
    "B2B Webdesign",
    "Shopify Agentur",
    "AI Automation",
    "Photovoltaik Marketing",
    "EV Ladeinfrastruktur Marokko",
    "Android App Launch",
  ],
  openGraph: {
    title: "Westmonks — Digitale Infrastruktur, die skaliert",
    description:
      "Design, Commerce und Automation als ein zusammenhängendes Wachstumssystem.",
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Westmonks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Westmonks — Digitale Infrastruktur, die skaliert",
    description:
      "Design, Commerce und Automation als ein zusammenhängendes Wachstumssystem.",
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
