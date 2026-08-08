"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  Clock3,
  Download,
  Gauge,
  Headphones,
  Link2,
  LockKeyhole,
  MoveUpRight,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const modules: Array<{
  number: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  copy: string;
  trigger: string;
  result: string;
  tags: string[];
}> = [
  {
    number: "01",
    eyebrow: "FINANCE / ORDERS",
    icon: ReceiptText,
    title: "Financial & Order Sync",
    copy: "Automatische Rechnungsstellung über Lexoffice oder sevDesk und ein fehlerfreier Bestandsabgleich — ohne Exporte, Copy-Paste oder nachträgliche Korrekturen.",
    trigger: "Neue Bestellung",
    result: "Rechnung + Bestand synchron",
    tags: ["Shopify", "Lexoffice", "sevDesk"],
  },
  {
    number: "02",
    eyebrow: "SERVICE / RETOUREN",
    icon: Bot,
    title: "Autonomous AI Support",
    copy: "Ein KI-Agent, der rund um die Uhr Kundenanfragen beantwortet, Retouren strukturiert abwickelt und kaufbereite Leads vorqualifiziert.",
    trigger: "Kundenanfrage",
    result: "Antwort + nächster Schritt",
    tags: ["24/7 Support", "Retouren", "Lead-Scoring"],
  },
  {
    number: "03",
    eyebrow: "LOGISTIK / FULFILLMENT",
    icon: Workflow,
    title: "Custom Operations",
    copy: "Maßgeschneiderte Make.com- und Zapier-Workflows für exklusive Logistik-, Fulfillment- und Backoffice-Prozesse, die Standard-Apps nicht abbilden.",
    trigger: "Individuelles Ereignis",
    result: "Definierte Operation ausgeführt",
    tags: ["Make.com", "Zapier", "3PL / Fulfillment"],
  },
];

const previewFlows: Array<{
  icon: LucideIcon;
  label: string;
  status: string;
}> = [
  {
    icon: ReceiptText,
    label: "Neue Bestellung",
    status: "Rechnung erstellt",
  },
  {
    icon: RefreshCw,
    label: "Bestandsänderung",
    status: "Systeme synchron",
  },
  {
    icon: Headphones,
    label: "Retourenanfrage",
    status: "KI-Workflow aktiv",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionKicker({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-[11px]">
      <span className="text-signal">{index}</span>
      <span className="h-px w-8 bg-white/15" aria-hidden="true" />
      {children}
    </div>
  );
}

function getBookingEmbedUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    const isCal = url.hostname === "cal.com" || url.hostname.endsWith(".cal.com");
    const theme = isCal
      ? {
          embed: "1",
          theme: "dark",
          layout: "month_view",
        }
      : {
          hide_gdpr_banner: "1",
          background_color: "050505",
          text_color: "f4f4ef",
          primary_color: "c7ff4a",
        };

    Object.entries(theme).forEach(([key, themeValue]) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, themeValue);
    });

    return url.toString();
  } catch {
    return value;
  }
}

export default function Home() {
  const [downloadState, setDownloadState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const bookingUrl = getBookingEmbedUrl(
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
      process.env.NEXT_PUBLIC_CALENDLY_URL?.trim(),
  );

  async function handleBlueprintRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) return;

    setDownloadState("loading");

    try {
      const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim();

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "shopify-automatisierungs-blueprint",
          }),
        });

        if (!response.ok) {
          throw new Error("Lead endpoint rejected the request");
        }
      }

      const download = document.createElement("a");
      download.href = "/automatisierungs-blueprint.pdf";
      download.download = "Westmonks-Automatisierungs-Blueprint.pdf";
      document.body.appendChild(download);
      download.click();
      download.remove();

      form.reset();
      setDownloadState("success");
    } catch {
      setDownloadState("error");
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main id="main" className="noise overflow-hidden bg-ink text-paper">
        <a
          href="#content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-black transition-transform focus:translate-y-0"
        >
          Zum Inhalt springen
        </a>

        <header className="absolute inset-x-0 top-0 z-50">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
            <a
              href="#main"
              className="relative block h-10 w-[142px] overflow-hidden sm:w-[176px]"
              aria-label="Westmonks Startseite"
            >
              <Image
                src="https://res.cloudinary.com/kpcyenmx/image/upload/f_auto,q_auto/westmonks-logo-transparent_lzgn9i"
                alt="Westmonks"
                fill
                priority
                sizes="(min-width: 640px) 176px, 142px"
                className="scale-[1.7] object-contain"
              />
            </a>

            <nav className="hidden items-center gap-8 text-sm text-zinc-400 lg:flex">
              <a className="transition-colors hover:text-white" href="#system">
                Betriebssystem
              </a>
              <a className="transition-colors hover:text-white" href="#ownership">
                Ownership
              </a>
              <a className="transition-colors hover:text-white" href="#blueprint">
                Blueprint
              </a>
            </nav>

            <a
              href="#booking"
              className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 text-xs font-medium text-white backdrop-blur-xl transition-colors hover:border-signal/50 hover:bg-signal hover:text-black sm:px-5 sm:text-sm"
            >
              <span className="hidden sm:inline">Automatisierungs-Check</span>
              <span className="sm:hidden">Check buchen</span>
              <MoveUpRight
                className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </header>

        <section className="relative isolate min-h-[100svh] border-b border-white/10">
          <div
            className="absolute inset-0 bg-[url('/shopify-operations-poster.webp')] bg-cover bg-center"
            aria-hidden="true"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/shopify-operations-poster.webp"
              className="hero-video h-full w-full object-cover object-center"
              tabIndex={-1}
            >
              <source src="/shopify-operations-loop.mp4" type="video/mp4" />
            </video>
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,.96)_27%,rgba(5,5,5,.58)_66%,rgba(5,5,5,.18)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.78)_0%,transparent_24%,transparent_70%,#050505_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_48%,transparent_0%,rgba(5,5,5,.05)_30%,rgba(5,5,5,.72)_78%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1440px] items-end gap-12 px-5 pb-10 pt-32 sm:px-8 sm:pb-12 sm:pt-40 lg:grid-cols-[1.13fr_.87fr] lg:items-center lg:gap-14 lg:px-12 lg:pb-10 lg:pt-32">
            <div className="max-w-[870px]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/[0.07] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-signal backdrop-blur-xl sm:text-[10px]"
              >
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-40" />
                  <span className="relative inline-flex size-2 rounded-full bg-signal" />
                </span>
                Shopify Operations Engineering
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.92,
                  delay: 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-balance text-[clamp(3.15rem,6.25vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.058em]"
              >
                Dein Shopify-Store wächst —
                <span className="block text-zinc-500">aber dein Team ertrinkt</span>
                <span className="block">im manuellen Chaos.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.72,
                  delay: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-8 max-w-3xl text-balance text-base leading-7 text-zinc-300 sm:text-xl sm:leading-8"
              >
                Wir bauen die Backend-Automatisierungen und KI-Systeme, die
                Rechnungen schreiben, Bestände abgleichen und deinen Support
                übernehmen. <strong className="font-medium text-white">Ohne Personalaufwand.</strong>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.72,
                  delay: 0.31,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  href="#booking"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-signal px-7 text-sm font-semibold text-black shadow-signal transition-shadow hover:shadow-[0_0_55px_rgba(199,255,74,.2)] sm:text-base"
                >
                  Automatisierungs-Check buchen
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.a>
                <a
                  href="#system"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-black/20 px-7 text-sm font-medium text-zinc-300 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white sm:text-base"
                >
                  System ansehen
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500 sm:text-sm"
              >
                {[
                  "In deinem Workspace",
                  "Sauber dokumentiert",
                  "Optionaler SLA-Betrieb",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-signal" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-label="Beispielhafter Automatisierungsstatus"
              className="relative mx-auto w-full max-w-[470px] overflow-hidden rounded-[1.6rem] border border-white/15 bg-black/55 shadow-[0_30px_120px_rgba(0,0,0,.55)] backdrop-blur-xl lg:justify-self-end"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500 sm:px-6">
                <span>Systemvorschau / Operations Layer</span>
                <span className="flex items-center gap-2 text-signal">
                  <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_rgba(199,255,74,.8)]" />
                  Aktiv
                </span>
              </div>

              <div className="p-3 sm:p-4">
                {previewFlows.map((flow, index) => {
                  const Icon = flow.icon;
                  return (
                    <motion.div
                      key={flow.label}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.55, delay: 0.46 + index * 0.1 }}
                      className="mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-4 last:mb-0"
                    >
                      <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-black/40 text-signal">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-medium text-zinc-200 sm:text-sm">
                          {flow.label}
                        </p>
                        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-600">
                          Event verarbeitet
                        </p>
                      </div>
                      <span className="text-right text-[10px] text-zinc-400 sm:text-xs">
                        {flow.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-white/[0.025]">
                <div className="px-5 py-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600">
                    Zielzustand
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-300 sm:text-sm">
                    Kein Copy-Paste
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600">
                    Architektur
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-300 sm:text-sm">
                    Modular & dokumentiert
                  </p>
                </div>
              </div>
            </motion.aside>

            <div className="border-t border-white/10 pt-5 lg:col-span-2 lg:-mt-4">
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-[0.17em] text-zinc-600 sm:text-[10px]">
                <span>Shopify</span>
                <span>Lexoffice / sevDesk</span>
                <span>AI Support</span>
                <span>Make.com / Zapier</span>
                <span>3PL / Fulfillment</span>
              </div>
            </div>
          </div>
        </section>

        <div id="content">
          <section
            id="system"
            className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
          >
            <div
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(199,255,74,.35),transparent)]"
              aria-hidden="true"
            />
            <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <Reveal className="lg:sticky lg:top-28 lg:h-fit">
                <SectionKicker index="01">Die Kern-Engine</SectionKicker>
                <h2 className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[5.6rem]">
                  Das Shopify-
                  <span className="block text-zinc-600">Betriebssystem</span>
                </h2>
                <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                  Kein Sammelsurium aus einzelnen Zaps. Ein kontrollierter
                  Datenfluss, in dem Bestellungen, Finanzen, Bestand, Support und
                  Fulfillment zuverlässig ineinandergreifen.
                </p>

                <div className="mt-10 hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:block">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                    Ein Ereignis. Ein definierter Ablauf.
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                    <span>Shopify Event</span>
                    <ArrowRight className="size-3.5 text-signal" aria-hidden="true" />
                    <span>Orchestration</span>
                    <ArrowRight className="size-3.5 text-signal" aria-hidden="true" />
                    <span>Ergebnis</span>
                  </div>
                </div>
              </Reveal>

              <div className="relative">
                <div
                  className="absolute bottom-16 left-[25px] top-16 w-px bg-[linear-gradient(180deg,transparent,rgba(199,255,74,.38),transparent)] sm:left-[33px]"
                  aria-hidden="true"
                />

                <div className="space-y-5">
                  {modules.map((module, index) => {
                    const Icon = module.icon;
                    return (
                      <Reveal key={module.title} delay={index * 0.08}>
                        <motion.article
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-5 transition-colors hover:border-signal/25 sm:rounded-[2rem] sm:p-8"
                        >
                          <div
                            className="absolute -right-20 -top-20 size-64 rounded-full bg-signal/0 blur-3xl transition-colors duration-500 group-hover:bg-signal/[0.055]"
                            aria-hidden="true"
                          />

                          <div className="relative grid gap-6 sm:grid-cols-[68px_1fr] sm:gap-8">
                            <div className="relative z-10 flex items-start justify-between sm:block">
                              <span className="grid size-[52px] place-items-center rounded-2xl border border-signal/20 bg-signal/[0.07] text-signal sm:size-[68px] sm:rounded-[1.35rem]">
                                <Icon className="size-5 sm:size-6" aria-hidden="true" />
                              </span>
                              <span className="font-mono text-[9px] text-zinc-700 sm:mt-5 sm:block sm:text-center">
                                {module.number} / 03
                              </span>
                            </div>

                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-signal/70">
                                {module.eyebrow}
                              </p>
                              <h3 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                                {module.title}
                              </h3>
                              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-zinc-400 sm:text-base">
                                {module.copy}
                              </p>

                              <div className="mt-7 flex flex-wrap gap-2">
                                {module.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.13em] text-zinc-500"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="relative mt-7 grid gap-2 rounded-xl border border-white/[0.07] bg-black/35 p-3 sm:ml-[100px] sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-4">
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-700">
                                Trigger
                              </p>
                              <p className="mt-1 text-xs font-medium text-zinc-300 sm:text-sm">
                                {module.trigger}
                              </p>
                            </div>
                            <div className="hidden items-center gap-1 sm:flex" aria-hidden="true">
                              <span className="h-px w-6 bg-white/10" />
                              <span className="grid size-7 place-items-center rounded-full border border-signal/20 bg-signal/[0.07]">
                                <Zap className="size-3 text-signal" />
                              </span>
                              <span className="h-px w-6 bg-white/10" />
                            </div>
                            <div className="sm:text-right">
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-700">
                                Ergebnis
                              </p>
                              <p className="mt-1 text-xs font-medium text-zinc-300 sm:text-sm">
                                {module.result}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section
            id="ownership"
            className="relative border-y border-white/10 bg-[#080808] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
          >
            <div
              className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_78%)]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-[1320px]">
              <Reveal>
                <SectionKicker index="02">Build vs. Run</SectionKicker>
                <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end lg:gap-20">
                  <h2 className="text-balance text-4xl font-semibold leading-[0.97] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                    Keine Support-Fallen.
                    <span className="block text-zinc-600">Kein versteckter Lock-in.</span>
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-zinc-300 lg:justify-self-end lg:text-lg lg:leading-8">
                    Wir bauen das System in deinem eigenen Workspace auf. Es gehört
                    zu <strong className="font-medium text-white">100% dir.</strong> Auf
                    Wunsch sichern wir den Betrieb über modulare SLAs ab.
                  </p>
                </div>
              </Reveal>

              <div className="mt-14 grid gap-4 lg:grid-cols-2">
                <Reveal>
                  <article className="relative min-h-[410px] overflow-hidden rounded-[2rem] bg-signal p-7 text-black sm:p-10">
                    <div
                      className="absolute -right-20 -top-20 size-72 rounded-full border border-black/10"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute -right-6 -top-6 size-44 rounded-full border border-black/10"
                      aria-hidden="true"
                    />
                    <div className="relative flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl bg-black text-signal">
                        <Wrench className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">
                        Kernleistung
                      </span>
                    </div>
                    <div className="relative mt-16">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/55">
                        Build
                      </p>
                      <h3 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                        Wir bauen. Du besitzt.
                      </h3>
                      <p className="mt-5 max-w-lg text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
                        Audit, Architektur, Implementierung, Tests und Dokumentation
                        werden sauber in deiner Infrastruktur übergeben.
                      </p>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {["Audit", "Architektur", "Build", "Handover"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-black/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>

                <Reveal delay={0.08}>
                  <article className="relative min-h-[410px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-7 sm:p-10">
                    <div
                      className="absolute -bottom-32 -right-20 size-80 rounded-full bg-signal/[0.06] blur-3xl"
                      aria-hidden="true"
                    />
                    <div className="relative flex items-start justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-signal">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-500">
                        Optional
                      </span>
                    </div>
                    <div className="relative mt-16">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal/70">
                        Run
                      </p>
                      <h3 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                        Wir sichern ab. Du entscheidest.
                      </h3>
                      <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
                        Monitoring, Fehlerbehebung und Weiterentwicklung lassen sich
                        modular absichern — ohne dich dauerhaft an uns zu binden.
                      </p>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {["Monitoring", "Incidents", "Optimierung", "SLA"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-500"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </div>

              <Reveal delay={0.12}>
                <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
                  {[
                    { icon: Link2, title: "Deine Accounts", copy: "Alle Zugänge bleiben bei dir." },
                    { icon: PackageCheck, title: "Deine Workflows", copy: "Dokumentiert und übertragbar." },
                    { icon: Gauge, title: "Deine Entscheidung", copy: "Betrieb nur, wenn du ihn willst." },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="bg-[#080808] p-6 sm:p-7">
                        <Icon className="size-4 text-signal" aria-hidden="true" />
                        <h3 className="mt-4 text-sm font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                          {item.copy}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </section>

          <section
            id="blueprint"
            className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
          >
            <div
              className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-signal/[0.045] blur-[130px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-24">
              <Reveal className="relative mx-auto w-full max-w-[500px] lg:mx-0">
                <div
                  className="absolute -inset-8 rounded-[3rem] border border-signal/10 bg-signal/[0.025] blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative -rotate-2 rounded-[1.6rem] border border-white/10 bg-zinc-900 p-4 shadow-[0_30px_100px_rgba(0,0,0,.55)] transition-transform duration-500 hover:rotate-0 sm:p-5">
                  <div className="relative overflow-hidden rounded-[1.2rem] bg-[#ecece4] p-7 text-black sm:p-9">
                    <div
                      className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:38px_38px]"
                      aria-hidden="true"
                    />
                    <div className="relative flex items-center justify-between border-b border-black/15 pb-5 font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-500">
                      <span>Westmonks / Field Guide 01</span>
                      <span>12 Seiten</span>
                    </div>
                    <div className="relative pt-16 sm:pt-24">
                      <span className="inline-flex rounded-full bg-black px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.17em] text-signal">
                        Shopify Operations · 1.5 MB
                      </span>
                      <h3 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-5xl">
                        Der Automatisierungs-
                        <span className="block text-zinc-500">Blueprint.</span>
                      </h3>
                      <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-600">
                        20+ Stunden manuelle Arbeit identifizieren, priorisieren und
                        systematisch eliminieren.
                      </p>
                    </div>
                    <div className="relative mt-16 flex items-end justify-between border-t border-black/15 pt-5 sm:mt-24">
                      <span className="grid size-12 place-items-center rounded-full bg-signal">
                        <Download className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                        Audit · Priorisierung
                        <br />30-Tage-Roadmap
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <SectionKicker index="03">High-Value Lead Magnet</SectionKicker>
                <h2 className="text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl">
                  Der Automatisierungs-
                  <span className="block text-zinc-600">Blueprint</span>
                  <span className="mt-3 block text-xl font-medium tracking-[-0.02em] text-zinc-400 sm:text-3xl">
                    12 Seiten. Kein Füllmaterial.
                  </span>
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                  Wie du als Shopify-Händler monatlich mehr als 20 Stunden manuelle
                  Arbeit eliminierst. Kompakt, exakt <strong className="font-medium text-white">1.5 MB</strong> und
                  für B2B-Entscheider gebaut.
                </p>

                <ul className="mt-8 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                  {[
                    "Prozess-Audit in 15 Minuten",
                    "Automations-ROI priorisieren",
                    "Tool- und Workflow-Matrix",
                    "Konkrete 30-Tage-Roadmap",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="grid size-5 place-items-center rounded-full bg-signal/10 text-signal">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <form
                  className="mt-10"
                  onSubmit={handleBlueprintRequest}
                  aria-label="Shopify-Automatisierungs-Blueprint anfordern"
                >
                  <div className="flex flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-2 sm:flex-row">
                    <label htmlFor="blueprint-email" className="sr-only">
                      Geschäftliche E-Mail-Adresse
                    </label>
                    <input
                      id="blueprint-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      placeholder="name@shop.de"
                      aria-describedby="blueprint-note blueprint-status"
                      className="min-h-14 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-4 text-base text-white placeholder:text-zinc-600 focus:border-signal/30 focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={downloadState === "loading"}
                      className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-signal disabled:cursor-wait disabled:opacity-60"
                    >
                      {downloadState === "loading" ? "Wird vorbereitet …" : "Blueprint herunterladen"}
                      <Download
                        className="size-4 transition-transform group-hover:translate-y-0.5"
                        aria-hidden="true"
                      />
                    </motion.button>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
                    <p id="blueprint-note" className="flex items-center gap-2">
                      <LockKeyhole className="size-3.5" aria-hidden="true" />
                      Sofortiger Download. Kein Konto. Kein Spam.
                    </p>
                    <p id="blueprint-status" aria-live="polite">
                      {downloadState === "success" && "Download gestartet."}
                      {downloadState === "error" &&
                        "Download fehlgeschlagen. Bitte erneut versuchen."}
                    </p>
                  </div>
                </form>
              </Reveal>
            </div>
          </section>

          <section
            id="booking"
            className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
          >
            <div className="mx-auto max-w-[1440px]">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                  <div className="lg:sticky lg:top-28 lg:self-start">
                    <SectionKicker index="04">15-Minuten Strategiegespräch</SectionKicker>
                    <h2 className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[5.6rem]">
                      Schluss mit
                      <span className="block text-zinc-600">manuellem Aufwand.</span>
                    </h2>
                    <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                      In 15 Minuten identifizieren wir den teuersten manuellen
                      Prozess in deinem Shopify-Backend und prüfen, ob er sich
                      wirtschaftlich automatisieren lässt.
                    </p>

                    <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                      {[
                        "Teuersten operativen Engpass bestimmen",
                        "Machbarkeit und sinnvollsten Stack klären",
                        "Nächsten Schritt ohne Standard-Pitch festlegen",
                      ].map((item, index) => (
                        <div key={item} className="flex items-center gap-4 py-4 text-sm text-zinc-400">
                          <span className="font-mono text-[9px] text-signal">0{index + 1}</span>
                          {item}
                        </div>
                      ))}
                    </div>

                    <p className="mt-6 flex items-center gap-2 text-xs text-zinc-600">
                      <Clock3 className="size-3.5 text-signal" aria-hidden="true" />
                      15 Minuten · Remote · Klarer Fit-or-No-Fit
                    </p>
                  </div>

                  <div className="relative min-h-[700px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950 shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:rounded-[2rem]">
                    <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600 sm:px-7 sm:text-[9px]">
                      <span>Secure booking / Cal.com or Calendly</span>
                      <span className="flex items-center gap-2 text-signal">
                        <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_rgba(199,255,74,.75)]" />
                        15 Min
                      </span>
                    </div>

                    <iframe
                      title="15-minütigen Shopify-Automatisierungs-Check buchen"
                      src={bookingUrl || "about:blank"}
                      loading="lazy"
                      className="h-[646px] w-full bg-zinc-950"
                      allow="camera; microphone; fullscreen; payment"
                    />

                    {!bookingUrl && (
                      <div className="absolute inset-x-0 bottom-0 top-14 grid place-items-center bg-zinc-950 px-6 text-center">
                        <div className="max-w-md">
                          <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-signal/20 bg-signal/[0.06] text-signal">
                            <ArrowRight className="size-5" aria-hidden="true" />
                          </span>
                          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                            Kalender-Embed ist vorbereitet.
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-zinc-500">
                            Hinterlege deine Cal.com- oder Calendly-URL als
                            <code className="mx-1 rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                              NEXT_PUBLIC_BOOKING_URL
                            </code>
                            in Vercel. Das Dark-Mode-Embed erscheint automatisch.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>

        <footer className="border-t border-white/10 px-5 py-7 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-8 w-[120px] overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/kpcyenmx/image/upload/f_auto,q_auto/westmonks-logo-transparent_lzgn9i"
                  alt="Westmonks"
                  fill
                  sizes="120px"
                  className="scale-[1.7] object-contain"
                />
              </div>
              <span>© 2026</span>
            </div>
            <p className="font-mono uppercase tracking-[0.14em]">
              Shopify Operations · Automation · AI
            </p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}
