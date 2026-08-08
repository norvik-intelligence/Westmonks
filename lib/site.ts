/**
 * Zentrale Stammdaten der Website.
 *
 * WICHTIG: Die mit TODO markierten Felder MÜSSEN vor dem Livegang durch die
 * echten Daten ersetzt werden. Ohne vollständiges Impressum ist die Seite
 * nach § 5 DDG angreifbar.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://westmonks.de";

type Site = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  responseTime: string;
};

export const site: Site = {
  name: "Westmonks",
  legalName: "Westmonks", // TODO: vollständige Firmierung, z. B. "Westmonks GmbH" oder "Max Mustermann – Westmonks"
  tagline: "Shopify Operations & Automatisierung",
  description:
    "Wir bauen belastbare Backend-Systeme für wachsende Shopify-Stores: Rechnungen, Bestand, Support und Fulfillment laufen automatisiert statt manuell.",
  email: "hello@westmonks.de",
  phone: "", // TODO: optional, aber stark empfohlen für B2B-Vertrauen
  responseTime: "Antwort in der Regel innerhalb von 24 Stunden an Werktagen.",
};

/**
 * Preisrahmen. Wettbewerber im DACH-Raum nennen inzwischen offen Einstiegspreise
 * (haeufig vierstellig fuer Workshop bzw. MVP). Solange hier nichts steht, wird
 * der Abschnitt ohne Zahlen gerendert – das ist ein bewusster Nachteil.
 */
export const pricing: { auditPrice: string; buildFrom: string; currencyNote: string } = {
  auditPrice: "", // TODO: z. B. "1.500 €" – Festpreis fuer das Audit
  buildFrom: "", // TODO: z. B. "ab 4.500 €" – Einstieg fuer den Build
  currencyNote: "Alle Preise zzgl. USt.",
};

export const legal: Record<
  | "provider"
  | "representative"
  | "street"
  | "postalCode"
  | "city"
  | "country"
  | "register"
  | "vatId"
  | "contentResponsible",
  string
> = {
  /** § 5 DDG – Diensteanbieter */
  provider: "Westmonks", // TODO
  representative: "", // TODO: Name des Vertretungsberechtigten / Inhabers
  street: "", // TODO: Straße und Hausnummer
  postalCode: "", // TODO: PLZ
  city: "", // TODO: Ort
  country: "Deutschland",
  /** Optional, je nach Rechtsform */
  register: "", // TODO: z. B. "Amtsgericht Duisburg, HRB 12345" – bei Einzelunternehmen leer lassen
  vatId: "", // TODO: USt-IdNr. nach § 27a UStG, falls vorhanden
  /** § 18 Abs. 2 MStV – inhaltlich verantwortlich */
  contentResponsible: "", // TODO: Name, Anschrift
};

export const legalIsComplete =
  Boolean(legal.representative) &&
  Boolean(legal.street) &&
  Boolean(legal.postalCode) &&
  Boolean(legal.city);

export const navigation = [
  { href: "/#system", label: "System" },
  { href: "/#prozess", label: "Prozess" },
  { href: "/loesungen", label: "Lösungen" },
  { href: "/#analyse", label: "Analyse" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;
