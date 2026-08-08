/**
 * pSEO-Matrix.
 *
 * Grundregel dieser Datei: Kombinationen werden NICHT frei gekreuzt, sondern
 * kuratiert (siehe `pairings`). Jede erzeugte Seite bezieht ihren Inhalt zu
 * grossen Teilen aus branchen- und toolspezifischen Feldern, nicht aus einem
 * Template mit ausgetauschtem Ortsnamen. Das ist bewusst so gebaut: Google
 * behandelt massenhaft erzeugte, inhaltlich austauschbare Seiten seit dem
 * "scaled content abuse"-Update als Spam.
 */

export type Industry = {
  slug: string;
  name: string;
  /** Kurzform fuer Fliesstext, z. B. "Photovoltaik-Haendler" */
  audience: string;
  /** Was diese Branche im Bestellprofil einzigartig macht */
  orderProfile: string;
  /** Typische Auftragswerte / Volumina als Einordnung */
  volumeSignal: string;
  painPoints: string[];
  /** Sonderfaelle, an denen Standard-Apps scheitern */
  edgeCases: string[];
  /** Oeffentlich sichtbare Signale, die auf manuelle Prozesse hindeuten */
  publicSignals: string[];
  complianceNote: string;
};

export type Tool = {
  slug: string;
  name: string;
  category: "Buchhaltung" | "Workflow" | "Marketing" | "Warenwirtschaft" | "Support";
  /** Was das Tool von Haus aus gut kann */
  covers: string;
  /** Wo die Standardintegration endet – der eigentliche Verkaufsgrund */
  limits: string[];
  integrationNote: string;
};

export const industries: Industry[] = [
  {
    slug: "photovoltaik",
    name: "Photovoltaik & Speicher",
    audience: "Photovoltaik-Händler",
    orderProfile:
      "Wenige, dafür sehr hochpreisige Bestellungen mit langer Lieferzeit, häufigen Teillieferungen und einem hohen Anteil an B2B-Kunden mit abweichender Rechnungsadresse.",
    volumeSignal:
      "Typisch sind 40 bis 400 Bestellungen im Monat bei einem durchschnittlichen Warenkorb im vierstelligen Bereich.",
    painPoints: [
      "Angebote und Rechnungen für Anlagen werden manuell aus Shopify heraus in der Buchhaltung nachgebaut, weil Positionen, Nachlässe und Anzahlungen nicht 1:1 passen.",
      "Der Nullsteuersatz für Photovoltaikanlagen nach § 12 Abs. 3 UStG greift nur unter Bedingungen, die die Standardsteuerlogik des Shops nicht abbilden kann.",
      "Teillieferungen von Modulen, Wechselrichtern und Speichern erzeugen mehrere Belege pro Bestellung, die niemand automatisch zuordnet.",
    ],
    edgeCases: [
      "Anzahlung und Restzahlung zu einer Bestellung, jeweils mit eigenem Beleg",
      "Nullsteuersatz nur für den Anlagenteil, Regelsteuersatz für Zubehör in derselben Bestellung",
      "Rechnungsempfänger ist der Installateur, Lieferadresse die Baustelle",
    ],
    publicSignals: [
      "Konfigurator oder Angebotsformular statt reinem Warenkorb",
      "Explizite Hinweise auf Lieferzeiten und Verfügbarkeitsstatus",
      "Getrennte B2B- und B2C-Preisdarstellung",
    ],
    complianceNote:
      "Steuerliche Sonderfälle gehören in die Systemlogik, nicht in die Nacharbeit. Wie sie im Einzelfall zu bewerten sind, klärt dein Steuerberater – wir bilden die Entscheidung ab, die er vorgibt.",
  },
  {
    slug: "ev-ladeinfrastruktur",
    name: "EV-Ladeinfrastruktur",
    audience: "Anbieter von Ladeinfrastruktur",
    orderProfile:
      "Hardware, Installation und Serviceverträge in derselben Bestellung – also physische Ware, Dienstleistung und wiederkehrende Positionen gemischt.",
    volumeSignal:
      "Typisch sind 60 bis 500 Bestellungen im Monat, oft mit einem wachsenden Anteil an Rahmenverträgen für Flottenkunden.",
    painPoints: [
      "Hardware und Montageleistung landen in einem Beleg, müssen buchhalterisch aber getrennt behandelt werden.",
      "Förderfähige Positionen brauchen eine gesonderte Ausweisung, die manuell in jedes Dokument geschrieben wird.",
      "Seriennummern von Wallboxen werden für Garantie und Förderung gebraucht, existieren aber nur in einer separaten Liste.",
    ],
    edgeCases: [
      "Ein Auftrag, zwei Belegtypen: Warenrechnung und Leistungsnachweis",
      "Rahmenvertrag mit Abruf über mehrere Monate hinweg",
      "Seriennummernpflicht je ausgelieferter Einheit",
    ],
    publicSignals: [
      "Produktseiten mit Installationspaketen als Zusatzoption",
      "B2B-Anfrageformular parallel zum Checkout",
      "Hinweise auf Förderprogramme und Nachweispflichten",
    ],
    complianceNote:
      "Förder- und Nachweispflichten sind dokumentengetrieben. Genau solche Dokumentenketten lassen sich zuverlässig automatisieren, sobald die Regeln einmal sauber definiert sind.",
  },
  {
    slug: "consumer-electronics",
    name: "Tech- & Consumer-Electronics-Brands",
    audience: "Elektronik-Brands",
    orderProfile:
      "Hohe Bestellfrequenz, viele Varianten, spürbare Retourenquote und Garantiefälle, die weit nach dem Kauf auflaufen.",
    volumeSignal:
      "Typisch sind 500 bis 5.000 Bestellungen im Monat mit einer Retourenquote im niedrigen zweistelligen Prozentbereich.",
    painPoints: [
      "Retouren und Teilgutschriften werden in der Buchhaltung von Hand nachgezogen, weil die Standardsynchronisation nur ganze Bestellungen kennt.",
      "Support beantwortet dieselben Statusfragen mehrfach täglich, ohne dass die Antwort aus dem System kommt.",
      "Seriennummern und Garantiezeiträume liegen verstreut zwischen Shop, Helpdesk und Tabelle.",
    ],
    edgeCases: [
      "Teilretoure mit anteiliger Versandkostenerstattung",
      "Austauschgerät statt Gutschrift, ohne neue Zahlung",
      "Garantiefall Monate nach dem Kauf, ohne Bestellbezug im Ticket",
    ],
    publicSignals: [
      "Ausführliche Retouren- und Garantieseiten mit manuellen Schritten",
      "Support-Widget mit Formular statt Self-Service-Status",
      "Große Variantenmatrix pro Produkt",
    ],
    complianceNote:
      "Gutschriften und Teilgutschriften sind buchhalterisch heikel. Die Regel gehört einmal definiert und dann konsequent maschinell angewendet.",
  },
  {
    slug: "supplements",
    name: "Nahrungsergänzung & Supplements",
    audience: "Supplement-Brands",
    orderProfile:
      "Sehr hohe Bestellfrequenz bei niedrigem Warenkorb, starker Abo-Anteil und aggressivem E-Mail-Marketing.",
    volumeSignal:
      "Typisch sind 1.000 bis 20.000 Bestellungen im Monat, ein erheblicher Teil davon wiederkehrend.",
    painPoints: [
      "Abo-Bestellungen erzeugen monatlich Belege, deren Sonderfälle – Pause, Skip, Adressänderung – niemand sauber abbildet.",
      "Chargen- und Mindesthaltbarkeitsdaten werden außerhalb von Shopify gepflegt und beim Versand manuell abgeglichen.",
      "Marketing-Segmente werden per Export und Import aktuell gehalten statt per Ereignis.",
    ],
    edgeCases: [
      "Abo pausiert mitten im Abrechnungszeitraum",
      "Chargenwechsel bei laufendem Abo",
      "Bundle aus mehreren Artikeln mit eigener Bestandslogik",
    ],
    publicSignals: [
      "Abo-Option direkt auf der Produktseite",
      "Umfangreiche Bundle- und Sparpaket-Struktur",
      "Sichtbar aktives Newsletter- und Pop-up-Marketing",
    ],
    complianceNote:
      "Chargenrückverfolgbarkeit ist bei Lebensmitteln keine Kür. Wenn sie in einer Tabelle lebt, ist sie im Ernstfall nicht belastbar.",
  },
  {
    slug: "moebel-interior",
    name: "Möbel & Interior",
    audience: "Möbel- und Interior-Händler",
    orderProfile:
      "Sperrgut mit Speditionsversand, langen Vorlaufzeiten, Terminabsprachen und häufigen Teillieferungen.",
    volumeSignal:
      "Typisch sind 80 bis 800 Bestellungen im Monat bei hohem Warenkorb und langer Durchlaufzeit.",
    painPoints: [
      "Speditionstermine werden telefonisch vereinbart und danach von Hand in Shop und Kundenkommunikation nachgetragen.",
      "Teillieferungen aus verschiedenen Lagern erzeugen mehrere Sendungen zu einer Bestellung, ohne durchgängigen Status.",
      "Lieferzeiten auf der Produktseite stimmen nicht mit der realen Verfügbarkeit überein.",
    ],
    edgeCases: [
      "Zwei Sendungen, zwei Speditionen, eine Bestellung",
      "Wunschtermin des Kunden verschiebt die gesamte Kette",
      "Transportschaden mit Teilgutschrift und Nachlieferung",
    ],
    publicSignals: [
      "Lieferzeitangaben in Wochen statt Tagen",
      "Hinweise auf Speditionsversand und Terminvereinbarung",
      "Große Artikel mit Maß- und Gewichtsangaben",
    ],
    complianceNote:
      "Bei Sperrgut entscheidet die Statuskommunikation über die Supportlast. Jede nicht automatisch verschickte Statusmeldung erzeugt eine Rückfrage.",
  },
  {
    slug: "werkzeug-industriebedarf",
    name: "Werkzeug & Industriebedarf",
    audience: "Händler für Werkzeug und Industriebedarf",
    orderProfile:
      "Überwiegend B2B mit Kundenpreisen, Angeboten, Rechnungskauf und wiederkehrenden Bestellungen derselben Artikel.",
    volumeSignal:
      "Typisch sind 200 bis 2.000 Bestellungen im Monat, ein großer Teil davon von wiederkehrenden Firmenkunden.",
    painPoints: [
      "Angebote werden außerhalb von Shopify erstellt und bei Annahme händisch als Bestellung nachgebaut.",
      "Kundenindividuelle Preise und Rabattstaffeln leben in einer Tabelle statt in einer Regel.",
      "Zahlungsziele beim Rechnungskauf werden manuell überwacht und angemahnt.",
    ],
    edgeCases: [
      "Angebot mit Gültigkeitsdatum, das in eine Bestellung überführt wird",
      "Kundenspezifischer Preis überschreibt die Staffel",
      "Sammelrechnung über mehrere Lieferungen eines Monats",
    ],
    publicSignals: [
      "Login-Bereich für Geschäftskunden",
      "Preise erst nach Anmeldung sichtbar",
      "Angebotsanfrage als eigener Weg neben dem Warenkorb",
    ],
    complianceNote:
      "Im B2B entscheidet die Beleg- und Zahlungsverfolgung über die Liquidität. Mahnwesen von Hand ist der teuerste denkbare Prozess.",
  },
  {
    slug: "beauty-kosmetik",
    name: "Beauty & Kosmetik",
    audience: "Beauty-Brands",
    orderProfile:
      "Hohe Frequenz, starke Kampagnenspitzen, viele Sets und Bundles sowie ein hoher Anteil an Erstkäufern.",
    volumeSignal:
      "Typisch sind 800 bis 10.000 Bestellungen im Monat mit ausgeprägten Peaks um Kampagnen und Feiertage.",
    painPoints: [
      "Kampagnenspitzen lassen die Supportqueue überlaufen, weil Standardfragen nicht automatisch beantwortet werden.",
      "Bundles und Sets werden bestandsseitig nicht korrekt aufgelöst, was zu Überverkäufen führt.",
      "Marketing-Flows und Bestellstatus laufen getrennt, sodass Kunden widersprüchliche Nachrichten bekommen.",
    ],
    edgeCases: [
      "Set wird verkauft, obwohl eine Einzelkomponente ausverkauft ist",
      "Kampagnenrabatt kollidiert mit einem bestehenden Gutschein",
      "Geschenk ab Bestellwert, das bei Teilretoure zurückgefordert werden müsste",
    ],
    publicSignals: [
      "Viele Sets und Geschenkboxen im Sortiment",
      "Aktive Pop-ups, Countdown-Aktionen und Rabattlogik",
      "Häufige Ausverkauft-Zustände bei Einzelartikeln",
    ],
    complianceNote:
      "Bei Kampagnenspitzen bricht zuerst der Prozess, nicht der Shop. Wer die Peaks nicht automatisiert, kauft sie mit Überstunden.",
  },
  {
    slug: "fahrrad-e-mobility",
    name: "Fahrrad & E-Mobility",
    audience: "Fahrrad- und E-Mobility-Händler",
    orderProfile:
      "Hochpreisige Einzelartikel mit Seriennummern, Serviceleistungen, Leasing-Anteil und saisonalem Verlauf.",
    volumeSignal:
      "Typisch sind 100 bis 1.200 Bestellungen im Monat mit einem deutlichen Frühjahrs- und Sommerpeak.",
    painPoints: [
      "Rahmennummern und Garantiedaten werden getrennt vom Shop gepflegt und bei jedem Servicefall gesucht.",
      "Dienstrad-Leasing bringt einen zweiten Rechnungsempfänger ins Spiel, den die Standardlogik nicht kennt.",
      "Serviceleistungen und Inspektionen werden weder terminlich noch buchhalterisch mit der Bestellung verknüpft.",
    ],
    edgeCases: [
      "Leasinggeber zahlt, Endkunde erhält die Ware",
      "Rahmennummer muss vor Versand zugeordnet und dokumentiert werden",
      "Serviceinspektion mit eigenem Beleg zur bestehenden Bestellung",
    ],
    publicSignals: [
      "Leasing- oder Finanzierungshinweise im Checkout",
      "Servicebereich mit Terminanfrage",
      "Saisonale Verfügbarkeitshinweise",
    ],
    complianceNote:
      "Bei zwei Zahlungsbeteiligten ist die Belegzuordnung kein Detail, sondern die Grundlage der gesamten Buchhaltung.",
  },
  {
    slug: "fashion-mode",
    name: "Mode & Fashion",
    audience: "Fashion-Händler",
    orderProfile:
      "Viele Bestellungen mit kleinem bis mittlerem Warenkorb, aber einem sehr hohen Varianten-Anteil aus Größe mal Farbe – und einer Retourenquote, die in keiner anderen Branche so hoch liegt.",
    volumeSignal:
      "Typisch sind 500 bis 8.000 Bestellungen im Monat bei einer Retourenquote, die je nach Sortiment zwischen 30 und 60 Prozent liegt.",
    painPoints: [
      "Jede Retoure erzeugt Nacharbeit an drei Stellen gleichzeitig: Gutschrift in der Buchhaltung, Rückbuchung in den Bestand und eine Statusmeldung an den Kunden. Läuft einer der drei Schritte manuell, laufen alle drei auseinander.",
      "Teilretouren aus einer Bestellung mit Rabattcode sind der Klassiker: Wie viel Rabatt entfällt auf den zurückgeschickten Artikel, und wie viel Versandkosten werden anteilig erstattet?",
      "Der Größentausch ist wirtschaftlich ein Vorgang, technisch aber eine Retoure plus eine Neubestellung – und wird deshalb doppelt gezählt, in der Marge wie in der Statistik.",
    ],
    edgeCases: [
      "Teilretoure mit anteiliger Aufteilung von Rabatt und Versandkosten",
      "Größentausch als ein Vorgang statt Retoure plus Neubestellung",
      "Retoure trifft ein, bevor die Gutschrift gebucht ist – Bestand und Buchhaltung stehen auseinander",
    ],
    publicSignals: [
      "Größentabelle und Varianten-Picker mit Größe mal Farbe",
      "Kostenloses Rücksendelabel oder Retourenportal",
      "Saisonale Sale-Kategorien mit gestaffelten Rabatten",
    ],
    complianceNote:
      "Widerrufsrecht und Gewährleistung geben vor, was bei einer Retoure zu erstatten ist und was nicht. Wie das in deinem Sortiment auszulegen ist, klärt deine Rechtsberatung – wir bilden die Regel ab, die daraus folgt.",
  },
  {
    slug: "b2b-grosshandel",
    name: "B2B-Onlineshops",
    audience: "B2B-Händler",
    orderProfile:
      "Wiederkehrende Bestellungen bekannter Geschäftskunden auf Rechnung, mit Zahlungszielen, kundenindividuellen Preisen und Nettopreis-Darstellung statt Endkundenlogik.",
    volumeSignal:
      "Typisch sind 100 bis 1.500 Bestellungen im Monat bei stark schwankendem Warenkorb, weil Nachbestellungen und Rahmenabrufe nebeneinander laufen.",
    painPoints: [
      "Die USt-IdNr. des Kunden entscheidet über die Besteuerung, wird aber selten qualifiziert geprüft – und im Zweifel haftet der Händler für die Umsatzsteuer, die er nicht ausgewiesen hat.",
      "Rechnungskauf mit Zahlungsziel bedeutet Mahnwesen. Ohne Anbindung an die Buchhaltung merkt niemand, dass eine Rechnung seit sechs Wochen offen ist.",
      "Kundenindividuelle Preislisten und Staffelpreise werden im Shop gepflegt, in der Buchhaltung aber nochmal – zwei Quellen für denselben Preis sind eine Quelle für Differenzen.",
    ],
    edgeCases: [
      "Innergemeinschaftliche Lieferung mit qualifizierter Bestätigung der USt-IdNr. nach § 18e UStG",
      "Sammelrechnung zum Monatsende über mehrere Einzellieferungen",
      "Abweichende Preisliste je Kundengruppe bei identischem Artikel",
    ],
    publicSignals: [
      "Preise erst nach Login sichtbar, Nettopreis-Darstellung",
      "Mindestbestellwert oder Staffelpreise ab Menge",
      "Zahlungsart Rechnungskauf für registrierte Kunden",
    ],
    complianceNote:
      "Reverse-Charge und innergemeinschaftliche Lieferungen sind steuerlich der heikelste Teil im B2B-Handel. Die Bewertung im Einzelfall gehört zu deinem Steuerberater – wir sorgen dafür, dass seine Vorgabe im System konsequent greift statt nur im Kopf der Buchhaltung.",
  },
];

export const tools: Tool[] = [
  {
    slug: "lexoffice",
    name: "Lexware Office (lexoffice)",
    category: "Buchhaltung",
    covers:
      "Rechnungen und Gutschriften zu abgeschlossenen Standardbestellungen erzeugen, Zahlungen den Belegen zuordnen und alles GoBD-konform in die Buchhaltung übergeben.",
    limits: [
      "Sonderfälle mit gemischten Steuersätzen innerhalb einer Bestellung",
      "Anzahlungen, Teilzahlungen und Sammelrechnungen über mehrere Lieferungen",
      "Belege, die auf einen anderen Rechnungsempfänger als den Besteller laufen",
      "Teilgutschriften mit anteiliger Versandkostenerstattung",
    ],
    integrationNote:
      "Für den Standardfall gibt es fertige Apps im Shopify App Store, und die sind gut und günstig. Wir setzen dort an, wo dein Prozess vom Standardfall abweicht – und ersetzen keine App, die ihren Job bereits erledigt.",
  },
  {
    slug: "make",
    name: "Make",
    category: "Workflow",
    covers:
      "Visuelle Verkettung von Systemen über fertige Konnektoren, gut überschaubar auch für nicht-technische Teams.",
    limits: [
      "Kosten steigen mit jeder Operation, komplexe Szenarien werden schnell teuer",
      "Fehlerbehandlung und Wiederholungslogik müssen bewusst gebaut werden",
      "Ohne Konventionen entstehen schnell unwartbare Szenario-Landschaften",
    ],
    integrationNote:
      "Make ist eine gute Wahl, wenn Übersichtlichkeit wichtiger ist als Datenhoheit. Wir bauen die Szenarien in deinem Account – du behältst Zugriff und Eigentum.",
  },
  {
    slug: "n8n",
    name: "n8n",
    category: "Workflow",
    covers:
      "Workflow-Automatisierung mit der Option auf Self-Hosting in der EU, dadurch volle Kontrolle über Datenflüsse und keine nutzungsabhängigen Kosten pro Schritt.",
    limits: [
      "Self-Hosting bedeutet Verantwortung für Betrieb, Updates und Backups",
      "Weniger fertige Konnektoren als bei den kommerziellen Anbietern",
      "Ohne saubere Dokumentation wird der Workflow zur Blackbox",
    ],
    integrationNote:
      "Wenn personenbezogene Daten durch die Automatisierung laufen, ist Self-Hosting in der EU das sauberere Setup. Ob es für dich nötig ist, entscheidet dein Datenschutzbeauftragter – wir bauen beide Varianten.",
  },
  {
    slug: "klaviyo",
    name: "Klaviyo",
    category: "Marketing",
    covers:
      "Ereignisgesteuerte E-Mail- und SMS-Flows auf Basis von Shop- und Kundenverhalten.",
    limits: [
      "Kennt nur, was ihm als Ereignis übergeben wird – operative Zustände fehlen oft",
      "Segmente, die per Export gepflegt werden, sind systematisch veraltet",
      "Marketing- und Transaktionskommunikation widersprechen sich ohne gemeinsame Quelle",
    ],
    integrationNote:
      "Der größte Hebel liegt selten in besseren Betreffzeilen, sondern darin, dass Klaviyo den echten operativen Zustand kennt – Lieferverzug, Teilretoure, Abo-Pause.",
  },
  {
    slug: "billbee",
    name: "Billbee",
    category: "Warenwirtschaft",
    covers:
      "Kanalübergreifende Auftrags-, Bestands- und Versandabwicklung als Middleware zwischen Shop, Marktplätzen und Buchhaltung.",
    limits: [
      "Lohnt sich erst ab einem gewissen Volumen und mehreren Verkaufskanälen",
      "Eigene Regelwerke müssen gepflegt werden, sonst verlagert sich das Chaos nur",
      "Sonderfälle jenseits der Standardabläufe bleiben Handarbeit",
    ],
    integrationNote:
      "Ab etwa 500 Bestellungen im Monat oder beim zweiten Verkaufskanal wird eine Middleware sinnvoll. Darunter ist sie meist Overhead.",
  },
  {
    slug: "shopify-flow",
    name: "Shopify Flow",
    category: "Workflow",
    covers:
      "Regelbasierte Automatisierung innerhalb der Shopify-Welt: Tagging, Benachrichtigungen, einfache Bedingungen.",
    limits: [
      "Endet an der Grenze des Shopify-Ökosystems",
      "Keine belastbare Fehlerbehandlung für externe Systeme",
      "Komplexe Verzweigungen werden schnell unübersichtlich",
    ],
    integrationNote:
      "Flow ist kostenlos und für viele Aufgaben völlig ausreichend. Wir prüfen zuerst, ob dein Fall damit lösbar ist, bevor wir etwas Größeres bauen.",
  },
  {
    slug: "sevdesk",
    name: "sevDesk",
    category: "Buchhaltung",
    covers:
      "Belege zu abgeschlossenen Bestellungen erzeugen, Zahlungen über den Bankabgleich zuordnen und den Datenbestand für den Steuerberater vorbereiten.",
    limits: [
      "Retourengutschriften, die sich auf einen Teil einer Bestellung beziehen",
      "Wiederkehrende Sammelbelege über mehrere Lieferungen desselben Kunden",
      "Abweichende Erlöskonten je Warengruppe innerhalb einer Bestellung",
    ],
    integrationNote:
      "sevDesk und Lexware Office lösen dieselbe Aufgabe mit unterschiedlichem Zuschnitt. Wir bauen auf dem Tool auf, das bei dir bereits läuft – ein Wechsel lohnt sich fast nie allein wegen der Anbindung.",
  },
  {
    slug: "datev",
    name: "DATEV",
    category: "Buchhaltung",
    covers:
      "Die Übergabe an die Steuerkanzlei im erwarteten Format – Buchungsstapel auf dem vereinbarten Kontenrahmen, sauber getrennt nach Steuerschlüsseln.",
    limits: [
      "Es gibt keine direkte Shop-Anbindung – die Buchungslogik muss stehen, bevor exportiert wird",
      "Korrekturen nach dem Export sind aufwendig, weil die Kanzlei bereits verarbeitet hat",
      "Zuordnung von Zahlungsdienstleister-Auszahlungen zu einzelnen Bestellungen",
    ],
    integrationNote:
      "Beim DATEV-Export entscheidet sich nichts mehr – er macht nur sichtbar, ob die Buchungslogik davor stimmt. Wir setzen deshalb eine Stufe früher an und stimmen den Kontenrahmen vorher mit deiner Kanzlei ab.",
  },
];

/** Kuratierte Kombinationen – bewusst nicht vollständig gekreuzt. */
const pairings: Record<string, string[]> = {
  // Regel: eine Kombination pro Branche und Kategorie (Buchhaltung, Workflow,
  // Marketing, Warenwirtschaft). Zwei Make-URLs zur gleichen Branche erzeugen
  // Duplicate Content – die gleiche Schmerzpunkt-Logik mit ausgetauschtem Tool.
  photovoltaik: ["lexoffice", "make", "billbee"],
  "ev-ladeinfrastruktur": ["lexoffice", "n8n", "billbee"],
  "consumer-electronics": ["lexoffice", "klaviyo", "billbee"],
  supplements: ["klaviyo", "make", "billbee"],
  "moebel-interior": ["lexoffice", "make", "billbee"],
  "werkzeug-industriebedarf": ["lexoffice", "n8n", "billbee"],
  "beauty-kosmetik": ["lexoffice", "klaviyo", "billbee"],
  "fahrrad-e-mobility": ["lexoffice", "n8n", "billbee"],
  "fashion-mode": ["sevdesk", "billbee", "klaviyo"],
  "b2b-grosshandel": ["datev", "billbee", "n8n"],
};

export type Solution = {
  slug: string;
  industry: Industry;
  tool: Tool;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  situation: string;
  architecture: Array<{ step: string; title: string; body: string }>;
  faq: Array<{ question: string; answer: string }>;
};

function buildSolution(industry: Industry, tool: Tool): Solution {
  const slug = `${tool.slug}-automatisierung-${industry.slug}`;

  return {
    slug,
    industry,
    tool,
    h1: `${tool.name} automatisieren für ${industry.name}`,
    metaTitle: `${tool.name} × Shopify für ${industry.name} | Westmonks`,
    metaDescription:
      `${industry.name}: ${tool.name} und Shopify so verbinden, dass auch die Sonderfälle sauber laufen. ` +
      `Architektur, Grenzen der Standard-Apps und ein erster Hebel.`.slice(0, 158),
    lead: `${industry.orderProfile} Genau daran scheitert die Standardanbindung zwischen Shopify und ${tool.name} – nicht am Normalfall, sondern an der Ausnahme.`,
    situation: `${industry.volumeSignal} ${industry.complianceNote}`,
    architecture: [
      {
        step: "01",
        title: "Audit",
        body: `Wir gehen deine realen Bestellungen durch und trennen den Normalfall von der Ausnahme. Bei ${industry.audience}n sind das erfahrungsgemäß Fälle wie: ${industry.edgeCases.join("; ")}.`,
      },
      {
        step: "02",
        title: "Blueprint",
        body: `Wir legen fest, welche Fälle ${tool.name} von Haus aus abdeckt und welche eine eigene Regel brauchen. ${tool.integrationNote}`,
      },
      {
        step: "03",
        title: "Build",
        body: `Wir bauen die Automatisierung in deinem Workspace, inklusive Fehlerbehandlung und einer Eskalation für Fälle, die eine menschliche Entscheidung brauchen.`,
      },
      {
        step: "04",
        title: "Launch",
        body: `Wir führen kontrolliert ein, dokumentieren jede Regel im Klartext und übergeben. Kein Lock-in, keine Blackbox, kein Vertrag, der dich an uns bindet.`,
      },
    ],
    faq: [
      {
        question: `Reicht für ${industry.name} nicht eine fertige App aus dem Shopify App Store?`,
        answer: `Für den Standardfall oft ja – und dann solltest du genau die nehmen. ${tool.covers} Der Bedarf entsteht erst bei den Fällen, die daneben liegen: ${tool.limits.slice(0, 2).join(" sowie ")}. Wenn dich diese Fälle nicht betreffen, sagen wir dir das im Erstgespräch.`,
      },
      {
        question: `Was kostet uns der manuelle Prozess heute konkret?`,
        answer: `Das lässt sich erst nach dem Audit seriös beziffern. Der Rahmen ergibt sich aus deinem Volumen: ${industry.volumeSignal.toLowerCase()} Multipliziert mit der Bearbeitungszeit je Ausnahmefall entsteht die Zahl, über die sich das Projekt rechnet – oder eben nicht.`,
      },
      {
        question: `Wem gehört das fertige System?`,
        answer: `Dir. Wir bauen in deinem Account und deinem Workspace, dokumentieren die Logik und übergeben ohne technische Abhängigkeit von Westmonks. Laufende Tool-Kosten entstehen nur dort, wo ein externer Dienst für deinen Prozess nötig und von dir freigegeben ist.`,
      },
    ],
  };
}

export const solutions: Solution[] = industries.flatMap((industry) =>
  (pairings[industry.slug] ?? [])
    .map((toolSlug) => tools.find((tool) => tool.slug === toolSlug))
    .filter((tool): tool is Tool => Boolean(tool))
    .map((tool) => buildSolution(industry, tool)),
);

export const solutionSlugs = solutions.map((solution) => solution.slug);

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}

/** Verwandte Seiten fuer das interne Silo: gleiche Branche + gleiches Tool. */
export function getRelatedSolutions(current: Solution) {
  const sameIndustry = solutions.filter(
    (item) =>
      item.industry.slug === current.industry.slug && item.slug !== current.slug,
  );
  const sameTool = solutions.filter(
    (item) =>
      item.tool.slug === current.tool.slug &&
      item.industry.slug !== current.industry.slug,
  );

  return { sameIndustry, sameTool };
}
