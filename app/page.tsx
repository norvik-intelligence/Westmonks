import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  Check,
  ChevronRight,
  DatabaseZap,
  FileCheck2,
  Headphones,
  LineChart,
  MoveUpRight,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { ShopAnalyzer } from "@/components/shop-analyzer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { industries, solutions } from "@/lib/pseo-data";
import { pricing, site, siteUrl } from "@/lib/site";

const modules: Array<{
  icon: LucideIcon;
  number: string;
  title: string;
  copy: string;
  result: string;
  featured?: boolean;
}> = [
  {
    icon: ReceiptText,
    number: "01",
    title: "Financial Sync",
    copy: "Bestellungen, Rechnungen und Bestände laufen automatisch zusammen — auch bei Teillieferungen, Anzahlungen und abweichenden Rechnungsempfängern.",
    result: "Orders → Finance → Bestand",
  },
  {
    icon: Headphones,
    number: "02",
    title: "Autonomous Support",
    copy: "Wiederkehrende Kundenanfragen, Retouren und Statusabfragen werden eingeordnet und beantwortet — mit klarer Grenze, ab der ein Mensch übernimmt.",
    result: "Anfrage → Entscheidung → Antwort",
    featured: true,
  },
  {
    icon: Workflow,
    number: "03",
    title: "Operations Core",
    copy: "Fulfillment- und Backoffice-Prozesse werden zu einem belastbaren System, das mit deinem Store mitwächst statt bei jedem Peak zu brechen.",
    result: "Ereignis → Regel → Ausführung",
  },
  {
    icon: DatabaseZap,
    number: "04",
    title: "Exception Control",
    copy: "Sonderfälle landen nicht im Nirgendwo. Sie werden erkannt, priorisiert und mit klaren Eskalationswegen versehen.",
    result: "Signal → Prüfung → Übergabe",
  },
];

const processSteps = [
  [
    "01",
    "Audit",
    "Wir gehen deine echten Bestellungen durch und trennen den Normalfall von der Ausnahme. Am Ende steht eine Liste mit Aufwand pro Fall.",
  ],
  [
    "02",
    "Blueprint",
    "Wir legen fest, was eine fertige App übernimmt und was eine eigene Regel braucht. Inklusive Festpreis für den Build.",
  ],
  [
    "03",
    "Build",
    "Wir bauen und testen die Automationen direkt in deinem Workspace — mit Fehlerbehandlung, nicht nur mit dem Happy Path.",
  ],
  [
    "04",
    "Launch",
    "Wir führen kontrolliert ein, dokumentieren jede Regel im Klartext und übergeben ohne Blackbox.",
  ],
];

const capabilities = [
  [ReceiptText, "Bestellungen"],
  [RefreshCw, "Bestände"],
  [FileCheck2, "Rechnungen"],
  [Headphones, "Support"],
  [PackageCheck, "Fulfillment"],
  [LineChart, "Reporting"],
] as const;

const notForYou = [
  "Dein Prozess läuft komplett im Standard — dann reicht eine App aus dem Shopify App Store für zehn Euro im Monat, und wir sagen dir das.",
  "Du willst ein Tool mieten statt ein System besitzen. Wir bauen nichts, was ohne uns aufhört zu funktionieren.",
  "Du suchst Marketing, Theme-Entwicklung oder Shop-Design. Das machen andere besser.",
];

const forYou = [
  "Eure Ausnahmen kosten mehr Zeit als der Normalfall — Teillieferungen, B2B-Preise, Sonderfälle bei Steuer oder Retoure.",
  "Ihr habt mindestens zwei Systeme, zwischen denen jemand täglich Daten hin- und herträgt.",
  "Ihr wachst, und der Aufwand wächst eins zu eins mit. Genau das soll aufhören.",
];

const faq = [
  [
    "Braucht die Analyse Zugriff auf meinen Shop?",
    "Nein. Der erste Check nutzt ausschließlich öffentlich sichtbare Signale und benötigt weder Login noch interne Shopdaten. Entsprechend ist das Ergebnis eine Einschätzung, keine Messung.",
  ],
  [
    "Warum sollten wir das nicht einfach mit einer fertigen App lösen?",
    "In vielen Fällen solltet ihr genau das. Für die Standardsynchronisation zwischen Shopify und Lexware Office gibt es etablierte Apps ab etwa zehn Euro im Monat, und die machen ihren Job gut. Wir setzen dort an, wo euer Prozess vom Standard abweicht — und sagen euch im Erstgespräch, wenn das nicht der Fall ist.",
  ],
  [
    "Wem gehört das fertige System?",
    "Dir. Wir bauen in deinem Workspace und deinen Accounts, dokumentieren die Logik und übergeben ohne technische Abhängigkeit von Westmonks.",
  ],
  [
    "Was kostet das?",
    "Der Einstieg ist immer das Audit zum Festpreis. Daraus ergibt sich ein fester Preis für den Build — keine offene Stundenabrechnung. Wenn sich das Projekt nach dem Audit nicht rechnet, sagen wir das und ihr habt trotzdem eine belastbare Prozessdokumentation.",
  ],
  [
    "Entstehen laufende Tool-Kosten?",
    "Nur wenn ein externer Dienst für euren konkreten Prozess sinnvoll und von euch freigegeben ist. Solche Kosten werden vor dem Build transparent gemacht. Wenn Datenhoheit wichtig ist, ist auch ein selbst gehostetes Setup in der EU möglich.",
  ],
  [
    "Wie lange dauert das?",
    "Das Audit dauert in der Regel wenige Tage. Ein klar abgegrenzter erster Build liegt üblicherweise im Bereich von zwei bis vier Wochen bis zum Go-Live — abhängig davon, wie viele Sonderfälle abzubilden sind.",
  ],
  [
    "Was passiert nach der Übergabe?",
    "Ihr könnt das System selbst betreiben. Wenn ihr Absicherung wollt, ergänzen wir einen modularen Service für Überwachung und Weiterentwicklung — kündbar, ohne dass das System dabei stehen bleibt.",
  ],
];

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    email: site.email,
    description: site.description,
    areaServed: ["DE", "AT", "CH"],
    knowsAbout: [
      "Shopify Backend-Automatisierung",
      "Lexware Office Integration",
      "E-Commerce Operations",
      "Workflow-Automatisierung",
      "Retouren- und Fulfillment-Prozesse",
    ],
    serviceType: "Shopify Operations Engineering",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />

      <main id="main" className="min-h-screen overflow-hidden bg-[#d8f4ff] text-zinc-950">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-[#c9ff3d] px-5 py-3 text-sm font-semibold text-black transition-transform focus:translate-y-0"
        >
          Zum Inhalt springen
        </a>

        <section className="relative p-3 sm:p-5 lg:p-7">
          <div className="relative mx-auto min-h-[680px] max-w-[1500px] overflow-hidden rounded-[1.75rem] border-4 border-white bg-sky-500 shadow-[0_30px_100px_rgba(5,60,90,.2)] sm:min-h-[880px] sm:rounded-[2.5rem]">
            <Image
              src="/westmonks-sky-hero.webp"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,46,.08),rgba(0,56,85,.02)_45%,rgba(0,25,18,.38))]" />

            <SiteHeader absolute />

            <div
              id="main-content"
              className="relative z-10 mx-auto flex min-h-[680px] max-w-[1050px] flex-col items-center justify-center px-5 pb-24 pt-32 text-center text-white sm:min-h-[880px]"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-900 shadow-lg backdrop-blur">
                <span className="size-2 rounded-full bg-[#8edb00]" />
                Shopify Operations für DACH-Brands
              </div>
              <h1 className="max-w-[1000px] text-balance text-[clamp(2.7rem,7vw,7.7rem)] font-semibold leading-[0.88] tracking-[-0.065em] [text-shadow:0_4px_30px_rgba(0,42,70,.3)]">
                Wir bauen das System hinter deinem Shopify-Wachstum.
              </h1>
              <p className="mt-7 max-w-2xl text-balance text-base leading-7 text-white/90 [text-shadow:0_2px_18px_rgba(0,35,60,.35)] sm:text-xl">
                Rechnungen, Bestand, Support und Fulfillment werden zu einem
                automatisierten Betriebssystem — inklusive der Sonderfälle, an
                denen fertige Apps aufhören.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#analyse"
                  className="group inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#c9ff3d] pl-6 pr-2 text-sm font-bold text-black shadow-[0_16px_40px_rgba(135,200,0,.3)] transition-transform hover:-translate-y-1"
                >
                  Shop analysieren
                  <span className="grid size-10 place-items-center rounded-lg bg-black text-white">
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
                <a
                  href="#kontakt"
                  className="group inline-flex min-h-14 items-center gap-3 rounded-xl border border-white/70 bg-white/90 pl-6 pr-2 text-sm font-bold text-black backdrop-blur transition-transform hover:-translate-y-1"
                >
                  Direkt Kontakt aufnehmen
                  <span className="grid size-10 place-items-center rounded-lg border border-zinc-300 bg-white">
                    <ArrowDown className="size-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 border-x border-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
            {capabilities.map(([Icon, label]) => (
              <div
                key={label}
                className="flex min-h-24 items-center justify-center gap-3 border-b border-r border-zinc-200 px-4 text-sm font-semibold text-zinc-500 lg:border-b-0"
              >
                <Icon className="size-5 text-zinc-400" /> {label}
              </div>
            ))}
          </div>
        </section>

        <section id="system" className="scroll-mt-8 bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Das Shopify-Betriebssystem</span>
              <span>(01)</span>
            </Reveal>
            <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <h2 className="max-w-4xl text-balance text-[clamp(2.6rem,6vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
                Autonome Operations für eine Welt ohne Copy-Paste.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 lg:justify-self-end">
                Kein Sammelsurium aus Tools. Ein klares System, in dem Daten,
                Entscheidungen und Übergaben zuverlässig ineinandergreifen.
              </p>
            </Reveal>

            <div className="mt-16 grid border-l border-t border-zinc-200 md:grid-cols-2 xl:grid-cols-4">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Reveal key={module.title} delay={index * 0.06}>
                    <article
                      className={`group flex min-h-[430px] flex-col border-b border-r border-zinc-200 p-6 sm:p-8 ${module.featured ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`grid size-12 place-items-center rounded-full ${module.featured ? "bg-[#c9ff3d] text-black" : "bg-[#d8f4ff] text-sky-700"}`}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span
                          className={`text-xs ${module.featured ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          {module.number}
                        </span>
                      </div>
                      <h3 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">
                        {module.title}
                      </h3>
                      <p
                        className={`mt-4 leading-7 ${module.featured ? "text-zinc-400" : "text-zinc-600"}`}
                      >
                        {module.copy}
                      </p>
                      <div className="mt-auto pt-10">
                        <div
                          className={`flex items-center justify-between border-t pt-4 text-xs font-semibold ${module.featured ? "border-white/15 text-[#c9ff3d]" : "border-zinc-200 text-zinc-500"}`}
                        >
                          <span>{module.result}</span>
                          <ArrowRight className="size-4" />
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white pb-24 sm:pb-32">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
            <Reveal className="flex min-h-[440px] flex-col justify-between rounded-[1.5rem] bg-[#d8f4ff] p-7 sm:p-10">
              <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-sky-700">
                Dein System
              </span>
              <div>
                <p className="text-[clamp(4.5rem,10vw,9rem)] font-semibold leading-none tracking-[-0.08em]">
                  100%
                </p>
                <p className="mt-2 max-w-xs text-xl font-semibold tracking-tight">
                  Eigentum. Kein Lock-in. Keine Support-Falle.
                </p>
              </div>
            </Reveal>
            <Reveal
              delay={0.08}
              className="grid min-h-[440px] overflow-hidden rounded-[1.5rem] border border-zinc-200 sm:grid-cols-2"
            >
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-full">
                <Image
                  src="/westmonks-sky-hero.webp"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 640px) 35vw, 100vw"
                  className="object-cover object-left"
                />
              </div>
              <div className="flex flex-col justify-center bg-zinc-50 p-7 sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Build vs. Run
                </span>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  Wir bauen nicht nur Automationen. Wir bauen dein
                  Betriebssystem.
                </h3>
                <p className="mt-5 leading-7 text-zinc-600">
                  Es entsteht in deinem Workspace und gehört dir. Den laufenden
                  Betrieb sichern wir auf Wunsch modular und transparent ab.
                </p>
                <Link
                  href="/loesungen"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-950"
                >
                  Lösungen nach Branche ansehen <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="prozess" className="scroll-mt-8 bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Vom Engpass zum System</span>
              <span>(02)</span>
            </Reveal>
            <div className="mt-14 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <Reveal className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-zinc-950 p-6 text-white sm:p-8">
                <div className="absolute inset-0 opacity-75 [background:radial-gradient(circle_at_25%_15%,rgba(201,255,61,.35),transparent_26%),radial-gradient(circle_at_75%_75%,rgba(20,180,255,.45),transparent_32%)]" />
                <div className="relative flex h-full min-h-[500px] flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>OPERATIONS CORE</span>
                    <span>LIVE MAP</span>
                  </div>
                  <div className="mx-auto grid w-full max-w-md gap-3">
                    {(
                      [
                        [ReceiptText, "Order Event", "erfasst"],
                        [DatabaseZap, "System Logic", "geprüft"],
                        [PackageCheck, "Fulfillment", "ausgeführt"],
                      ] as const
                    ).map(([Icon, label, status]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                      >
                        <span className="grid size-11 place-items-center rounded-xl bg-[#c9ff3d] text-black">
                          <Icon className="size-5" />
                        </span>
                        <span className="font-semibold">{label}</span>
                        <span className="text-xs text-zinc-400">{status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#c9ff3d]">
                    <span className="size-2 animate-pulse rounded-full bg-[#c9ff3d]" />
                    System bereit
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="max-w-2xl text-balance text-[clamp(2.6rem,5vw,5.7rem)] font-semibold leading-[0.93] tracking-[-0.06em]">
                  Vom ersten Signal zur skalierbaren Realität.
                </h2>
                <div className="mt-10 border-l border-sky-300">
                  {processSteps.map(([number, title, copy]) => (
                    <div
                      key={number}
                      className="relative grid gap-2 border-b border-zinc-200 py-6 pl-9 sm:grid-cols-[140px_1fr] sm:gap-6"
                    >
                      <span className="absolute -left-4 top-6 grid size-8 place-items-center rounded-full bg-sky-400 text-xs font-bold text-white ring-8 ring-zinc-50">
                        {number}
                      </span>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="leading-7 text-zinc-600">{copy}</p>
                    </div>
                  ))}
                </div>
                {(pricing.auditPrice || pricing.buildFrom) && (
                  <p className="mt-8 rounded-2xl bg-white p-5 text-sm leading-7 text-zinc-600 ring-1 ring-zinc-200">
                    {pricing.auditPrice && (
                      <>
                        Audit zum Festpreis:{" "}
                        <strong className="text-zinc-950">
                          {pricing.auditPrice}
                        </strong>
                        .{" "}
                      </>
                    )}
                    {pricing.buildFrom && (
                      <>
                        Build{" "}
                        <strong className="text-zinc-950">
                          {pricing.buildFrom}
                        </strong>
                        , Festpreis nach Audit.{" "}
                      </>
                    )}
                    {pricing.currencyNote}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 py-24 text-white sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-white/20 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Engineering für Shopify Operations</span>
              <span>(03)</span>
            </Reveal>
            <Reveal className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-4xl text-balance text-[clamp(2.6rem,5.8vw,6.5rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
                Ein System. Vier operative Ebenen.
              </h2>
              <a
                href="#analyse"
                className="group inline-flex min-h-14 w-fit items-center gap-3 rounded-xl bg-[#c9ff3d] pl-5 pr-2 text-sm font-bold text-black"
              >
                Shop prüfen
                <span className="grid size-9 place-items-center rounded-lg bg-black text-white">
                  <MoveUpRight className="size-4" />
                </span>
              </a>
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {(
                [
                  [
                    ReceiptText,
                    "Financial & Order Sync",
                    "Bestellungen, Belege und Bestände bewegen sich synchron statt über Exporte und Listen — auch bei Anzahlung, Teillieferung und Sammelrechnung.",
                  ],
                  [
                    Bot,
                    "Autonomous Support",
                    "Anfragen werden verstanden, priorisiert und entlang deiner Regeln bearbeitet. Was eine Entscheidung braucht, geht an einen Menschen.",
                  ],
                  [
                    Boxes,
                    "Fulfillment Orchestration",
                    "Logistik-Ereignisse lösen die richtigen Folgeprozesse aus — inklusive Teillieferung, Speditionstermin und Transportschaden.",
                  ],
                  [
                    ShieldCheck,
                    "Exception Control",
                    "Abweichungen werden sichtbar, bevor aus einem Einzelfall ein operatives Problem wird.",
                  ],
                ] as const
              ).map(([Icon, title, copy], index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <article className="group relative min-h-[360px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#141414] p-7 sm:p-9">
                    <div
                      className={`absolute inset-x-0 bottom-0 h-2/3 opacity-80 transition-transform duration-700 group-hover:scale-110 ${index === 0 ? "[background:radial-gradient(ellipse_at_bottom,#a6e900,transparent_65%)]" : index === 1 ? "[background:radial-gradient(ellipse_at_bottom,#655cff,transparent_65%)]" : index === 2 ? "[background:radial-gradient(ellipse_at_bottom,#ff5722,transparent_65%)]" : "[background:radial-gradient(ellipse_at_bottom,#16bff4,transparent_65%)]"}`}
                    />
                    <div className="relative flex h-full min-h-[290px] flex-col">
                      <div className="flex items-start justify-between">
                        <Icon className="size-8" />
                        <span className="grid size-9 place-items-center rounded-full bg-white text-black">
                          <ChevronRight className="size-4" />
                        </span>
                      </div>
                      <div className="mt-auto max-w-lg rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {title}
                        </h3>
                        <p className="mt-3 leading-6 text-zinc-400">{copy}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Ehrliche Abgrenzung – der stärkste Vertrauensanker im DACH-B2B. */}
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Passt das überhaupt?</span>
              <span>(04)</span>
            </Reveal>
            <Reveal className="mt-12 max-w-3xl">
              <h2 className="text-balance text-[clamp(2.4rem,5vw,5.2rem)] font-semibold leading-[0.93] tracking-[-0.06em]">
                Wir sagen dir auch, wenn du uns nicht brauchst.
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                Für die Standardanbindung zwischen Shopify und der Buchhaltung
                gibt es fertige Apps ab etwa zehn Euro im Monat. Wenn dein
                Prozess dort hineinpasst, ist das die richtige Antwort — und
                nicht wir.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <Reveal className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-7 sm:p-9">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-zinc-500 ring-1 ring-zinc-200">
                  <X className="size-3.5" /> Eher nicht
                </span>
                <ul className="mt-6 space-y-4">
                  {notForYou.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-zinc-600">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal
                delay={0.08}
                className="rounded-[1.5rem] bg-zinc-950 p-7 text-white sm:p-9"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black">
                  <Check className="size-3.5" /> Sehr wahrscheinlich
                </span>
                <ul className="mt-6 space-y-4">
                  {forYou.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-zinc-300">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c9ff3d]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="analyse" className="scroll-mt-6 bg-white pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Live-Potenzialanalyse</span>
              <span>(05)</span>
            </Reveal>
            <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <h2 className="max-w-4xl text-balance text-[clamp(2.7rem,6.2vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Dein Engpass. Klar sichtbar.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 lg:justify-self-end">
                Gib deine öffentliche Shop-URL ein. Westmonks verdichtet
                sichtbare operative Signale zu einem klaren ersten Hebel — ohne
                Shop-Login.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-14">
              <ShopAnalyzer />
            </Reveal>
          </div>
        </section>

        {/* Branchen-Silo: interne Verlinkung in die pSEO-Ebene. */}
        <section className="bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Nach Branche</span>
              <span>(06)</span>
            </Reveal>
            <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <h2 className="max-w-3xl text-balance text-[clamp(2.4rem,5vw,5.2rem)] font-semibold leading-[0.93] tracking-[-0.06em]">
                Jede Branche bricht an einer anderen Stelle.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 lg:justify-self-end">
                Bei Photovoltaik ist es der Steuersatz, bei Möbeln der
                Speditionstermin, bei Supplements das Abo. Wähle deinen Fall.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry) => {
                const target = solutions.find(
                  (item) => item.industry.slug === industry.slug,
                );
                if (!target) return null;
                return (
                  <Link
                    key={industry.slug}
                    href={`/loesungen/${target.slug}`}
                    className="group flex min-h-[150px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-950"
                  >
                    <span className="font-semibold leading-6">
                      {industry.name}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                      Engpässe ansehen <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
            <Reveal className="mt-8">
              <Link
                href="/loesungen"
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-950"
              >
                Alle Lösungen im Überblick <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Immer erreichbarer Kontaktweg – unabhängig von der Analyse. */}
        <section id="kontakt" className="scroll-mt-6 bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Kontakt</span>
              <span>(07)</span>
            </Reveal>
            <div className="mt-12 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <Reveal>
                <h2 className="text-balance text-[clamp(2.4rem,5vw,5.2rem)] font-semibold leading-[0.93] tracking-[-0.06em]">
                  Zwei Sätze reichen.
                </h2>
                <p className="mt-6 leading-8 text-zinc-600">
                  Beschreib kurz, was euch am meisten Zeit kostet. Wir melden
                  uns mit einer ersten Einschätzung — ob und wie sich das lösen
                  lässt, und ob es sich für euch überhaupt rechnet.
                </p>
                <div className="mt-8 space-y-3 text-sm">
                  <p>
                    <a
                      className="text-lg font-semibold text-zinc-950 underline underline-offset-4"
                      href={`mailto:${site.email}`}
                    >
                      {site.email}
                    </a>
                  </p>
                  <p className="text-zinc-500">{site.responseTime}</p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <ContactForm context="Startseite / Kontaktbereich" />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="fragen" className="scroll-mt-6 bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Klare Antworten</span>
              <span>(08)</span>
            </Reveal>
            <div className="mt-12 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <Reveal>
                <h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                  Häufige Fragen.
                </h2>
                <p className="mt-5 max-w-md leading-7 text-zinc-600">
                  Kein Nebel, kein Lock-in. Hier sind die wichtigsten Antworten
                  vor dem ersten Gespräch.
                </p>
              </Reveal>
              <Reveal delay={0.08} className="border-t border-zinc-300">
                {faq.map(([question, answer]) => (
                  <details key={question} className="group border-b border-zinc-300 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold">
                      <span>{question}</span>
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-300 text-xl transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pt-4 leading-7 text-zinc-600">
                      {answer}
                    </p>
                  </details>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-white pt-20">
          <Reveal className="mx-auto max-w-[1440px] overflow-hidden px-5 sm:px-8 lg:px-12">
            <p className="whitespace-nowrap text-center text-[clamp(3.4rem,12vw,12rem)] font-semibold leading-none tracking-[-0.085em]">
              Chaos raus.
            </p>
          </Reveal>
          <div className="relative mt-10 overflow-hidden border-y-4 border-white bg-sky-500 py-24 sm:py-32">
            <Image
              src="/westmonks-sky-hero.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-sky-950/25" />
            <Reveal className="relative mx-auto max-w-4xl px-5 text-center text-white sm:px-8">
              <span className="inline-flex rounded-full border border-white/50 bg-white/90 px-4 py-2 text-xs font-bold text-zinc-950">
                Bereit für klare Operations?
              </span>
              <h2 className="mt-6 text-balance text-[clamp(2.6rem,6vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.065em] [text-shadow:0_4px_30px_rgba(0,35,60,.3)]">
                Dein Store wächst. Dein Aufwand nicht.
              </h2>
              <a
                href="#kontakt"
                className="group mx-auto mt-8 inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#c9ff3d] pl-6 pr-2 text-sm font-bold text-black shadow-xl"
              >
                <span>Anfrage senden</span>
                <span className="grid size-10 place-items-center rounded-lg bg-black text-white">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
