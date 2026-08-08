import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { legal, legalIsComplete, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. Verantwortlicher",
    body: (
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist der im{" "}
        <a className="underline underline-offset-4" href="/impressum">
          Impressum
        </a>{" "}
        genannte Anbieter. Kontakt für Datenschutzanfragen:{" "}
        <a
          className="font-semibold text-zinc-950 underline underline-offset-4"
          href={`mailto:${site.email}`}
        >
          {site.email}
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. Hosting und Server-Logfiles",
    body: (
      <>
        <p>
          Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut,
          CA 91789, USA, gehostet. Beim Aufruf der Seite verarbeitet der Anbieter
          technisch notwendige Verbindungsdaten, insbesondere IP-Adresse,
          Zeitpunkt der Anfrage, aufgerufene Ressource, Referrer und
          Browserkennung.
        </p>
        <p className="mt-4">
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
          Interesse liegt im sicheren und stabilen Betrieb der Website. Die
          Übermittlung in die USA erfolgt auf Grundlage der Standardvertrags­klauseln
          sowie des EU-US Data Privacy Framework.
        </p>
      </>
    ),
  },
  {
    title: "3. Kontaktformular und E-Mail",
    body: (
      <>
        <p>
          Wenn du uns über das Kontaktformular oder per E-Mail schreibst,
          verarbeiten wir die von dir angegebenen Daten — Name, E-Mail-Adresse,
          optional Unternehmen sowie den Inhalt deiner Nachricht — zur
          Bearbeitung der Anfrage.
        </p>
        <p className="mt-4">
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf
          einen Vertragsabschluss gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f
          DSGVO aufgrund unseres berechtigten Interesses an der Beantwortung.
        </p>
        <p className="mt-4">
          Der Versand erfolgt über unseren E-Mail-Dienstleister. Die Nachrichten
          werden in unserem Postfach gespeichert und gelöscht, sobald die
          Anfrage abschließend bearbeitet ist und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
        <p className="mt-4">
          Zur Abwehr automatisierter Anfragen verarbeiten wir zusätzlich
          kurzzeitig die IP-Adresse zur Begrenzung der Anfragehäufigkeit. Diese
          Information wird nicht dauerhaft gespeichert.
        </p>
      </>
    ),
  },
  {
    title: "4. Shop-Analyse",
    body: (
      <>
        <p>
          Die auf der Startseite angebotene Analyse verarbeitet ausschließlich
          die von dir eingegebene, öffentlich erreichbare Domain. Diese Domain
          wird an die Google Ireland Limited beziehungsweise Google LLC
          übermittelt, um die öffentlich zugängliche Startseite auszuwerten
          (Gemini API mit URL-Kontext).
        </p>
        <p className="mt-4">
          Es werden dabei keine personenbezogenen Daten von dir übermittelt und
          kein Zugriff auf interne Shopdaten genommen. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt in der Bereitstellung
          der angefragten Funktion. Das Ergebnis wird für maximal 15 Minuten
          zwischengespeichert, um wiederholte Abfragen derselben Domain zu
          vermeiden.
        </p>
      </>
    ),
  },
  {
    title: "5. Bildauslieferung",
    body: (
      <p>
        Ein Teil der Bilddateien wird über Cloudinary (Cloudinary Ltd.)
        ausgeliefert. Dabei verarbeitet der Anbieter technisch notwendige
        Verbindungsdaten einschließlich der IP-Adresse. Rechtsgrundlage ist Art.
        6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt in der schnellen
        und zuverlässigen Auslieferung der Website.
      </p>
    ),
  },
  {
    title: "6. Cookies und Tracking",
    body: (
      <p>
        Diese Website setzt keine Analyse-, Marketing- oder Tracking-Cookies ein.
        Es findet keine Profilbildung und kein Einsatz von Diensten Dritter zu
        Werbezwecken statt. Ein Einwilligungsbanner ist deshalb nicht
        erforderlich. Sollte sich das ändern, wird diese Erklärung vorab
        angepasst.
      </p>
    ),
  },
  {
    title: "7. Deine Rechte",
    body: (
      <>
        <p>
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
          Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen Verarbeitungen
          auf Grundlage berechtigter Interessen (Art. 21 DSGVO). Eine erteilte
          Einwilligung kannst du jederzeit mit Wirkung für die Zukunft
          widerrufen.
        </p>
        <p className="mt-4">
          Außerdem steht dir ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu, in der Regel bei der Behörde deines
          gewöhnlichen Aufenthaltsorts.
        </p>
      </>
    ),
  },
];

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-[#d8f4ff]">
      <SiteHeader />

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
            Datenschutzerklärung
          </h1>

          {!legalIsComplete && (
            <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <strong>Hinweis für den Betreiber:</strong> Dieser Text ist ein
              sorgfältig erstellter Entwurf, aber keine Rechtsberatung. Ergänze
              die Angaben in{" "}
              <code className="rounded bg-amber-100 px-1">lib/site.ts</code> und
              lass die Erklärung vor dem Livegang prüfen — insbesondere, sobald
              weitere Dienste hinzukommen.
            </p>
          )}

          <div className="mt-10 space-y-10 rounded-[1.5rem] bg-white p-7 leading-7 text-zinc-700 sm:p-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {section.title}
                </h2>
                <div className="mt-4">{section.body}</div>
              </div>
            ))}

            <p className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
              Anbieter: {legal.provider}
              {legal.city ? `, ${legal.city}` : ""}. Stand dieser Erklärung:
              laufend gepflegt, siehe Versionsverlauf des Projekts.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
