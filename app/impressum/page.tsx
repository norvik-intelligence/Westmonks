import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { legal, legalIsComplete, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung nach § 5 DDG.",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#d8f4ff]">
      <SiteHeader />

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
            Impressum
          </h1>

          {!legalIsComplete && (
            <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <strong>Hinweis für den Betreiber:</strong> Diese Seite ist noch
              unvollständig. Trage die fehlenden Angaben in{" "}
              <code className="rounded bg-amber-100 px-1">lib/site.ts</code> ein.
              Eine unvollständige Anbieterkennzeichnung ist abmahnfähig.
            </p>
          )}

          <div className="mt-10 space-y-10 rounded-[1.5rem] bg-white p-7 leading-7 text-zinc-700 sm:p-10">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Angaben gemäß § 5 DDG
              </h2>
              <p className="mt-4">
                {legal.provider}
                {legal.representative && (
                  <>
                    <br />
                    {legal.representative}
                  </>
                )}
                {legal.street && (
                  <>
                    <br />
                    {legal.street}
                  </>
                )}
                {(legal.postalCode || legal.city) && (
                  <>
                    <br />
                    {[legal.postalCode, legal.city].filter(Boolean).join(" ")}
                  </>
                )}
                <br />
                {legal.country}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Kontakt</h2>
              <p className="mt-4">
                E-Mail:{" "}
                <a
                  className="font-semibold text-zinc-950 underline underline-offset-4"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
                {site.phone && (
                  <>
                    <br />
                    Telefon: {site.phone}
                  </>
                )}
              </p>
            </div>

            {legal.register && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  Registereintrag
                </h2>
                <p className="mt-4">{legal.register}</p>
              </div>
            )}

            {legal.vatId && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  Umsatzsteuer-Identifikationsnummer
                </h2>
                <p className="mt-4">
                  Gemäß § 27a Umsatzsteuergesetz: {legal.vatId}
                </p>
              </div>
            )}

            {legal.contentResponsible && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  Redaktionell verantwortlich
                </h2>
                <p className="mt-4">{legal.contentResponsible}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Streitbeilegung
              </h2>
              <p className="mt-4">
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung bereit:{" "}
                <a
                  className="underline underline-offset-4"
                  href="https://ec.europa.eu/consumers/odr/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ec.europa.eu/consumers/odr
                </a>
                . Wir sind nicht bereit und nicht verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Haftung</h2>
              <p className="mt-4">
                Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für die
                Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
                wir jedoch keine Gewähr übernehmen. Für Inhalte externer Links
                ist ausschließlich deren Betreiber verantwortlich; zum Zeitpunkt
                der Verlinkung waren keine Rechtsverstöße erkennbar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
