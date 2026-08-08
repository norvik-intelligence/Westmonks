"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Cpu,
  Download,
  Gauge,
  Layers3,
  LockKeyhole,
  Monitor,
  MoveUpRight,
  ShoppingCart,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

const services: Array<{
  number: string;
  icon: LucideIcon;
  title: string;
  copy: string;
  outcome: string;
}> = [
  {
    number: "01",
    icon: Monitor,
    title: "High-Performance Webdesign.",
    copy: "Websites, die nicht nur als Visitenkarte dienen, sondern 24/7 B2B-Leads für hochpreisige Solar-Projekte oder App-Launches generieren.",
    outcome: "Positionierung · UX · Conversion",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Shopify E-Commerce.",
    copy: "Verkaufspsychologisch optimierte Shops, die komplexe Hardware und Dienstleistungen reibungslos verkaufen.",
    outcome: "Storefront · Checkout · Retention",
  },
  {
    number: "03",
    icon: Cpu,
    title: "AI & Backend Automation.",
    copy: "Intelligente KI-Agenten für den 24/7 Support und automatisierte Prozesse, die wöchentlich dutzende Stunden sparen.",
    outcome: "Workflows · Agents · Operations",
  },
];

const advantages = [
  {
    icon: Layers3,
    title: "Ein System",
    copy: "Marke, Website, Shop und Automation greifen ohne Brüche ineinander.",
  },
  {
    icon: Gauge,
    title: "Ein KPI-Modell",
    copy: "Jede Entscheidung wird auf Geschwindigkeit, Conversion und Marge ausgerichtet.",
  },
  {
    icon: Zap,
    title: "Ein verantwortliches Team",
    copy: "Keine Übergabeschleifen, keine drei Briefings, kein Zuständigkeits-Pingpong.",
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
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
      <span className="h-px w-8 bg-signal" aria-hidden="true" />
      {children}
    </div>
  );
}

function getCalendlyEmbedUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    const theme = {
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

  const calendlyUrl = getCalendlyEmbedUrl(
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
            source: "automatisierungs-blueprint",
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

        <header className="absolute inset-x-0 top-0 z-40">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
            <a
              href="#main"
              className="relative block h-10 w-[150px] overflow-hidden sm:w-[180px]"
              aria-label="Westmonks Startseite"
            >
              <Image
                src="https://res.cloudinary.com/kpcyenmx/image/upload/f_auto,q_auto/westmonks-logo-transparent_lzgn9i"
                alt="Westmonks"
                fill
                priority
                sizes="(min-width: 640px) 180px, 150px"
                className="scale-[1.7] object-contain"
              />
            </a>

            <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
              <a className="transition-colors hover:text-white" href="#services">
                Leistungen
              </a>
              <a className="transition-colors hover:text-white" href="#blueprint">
                Blueprint
              </a>
              <a className="transition-colors hover:text-white" href="#booking">
                Kontakt
              </a>
            </nav>

            <a
              href="#booking"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:border-signal/50 hover:bg-signal hover:text-black sm:px-5 sm:text-sm"
            >
              Analyse buchen
              <MoveUpRight
                className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </header>

        <section className="relative flex min-h-screen items-center justify-center px-5 pb-16 pt-28 sm:px-8 lg:px-12">
          <div className="grid-surface absolute inset-0" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-[12%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-signal/[0.055] blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="signal-line absolute left-1/2 top-0 h-px w-[65vw] -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-xl sm:text-[11px]"
            >
              <Sparkles className="size-3.5 text-signal" aria-hidden="true" />
              Design × Commerce × Automation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-balance text-[clamp(3rem,7.4vw,7.4rem)] font-semibold leading-[0.92] tracking-tighter"
            >
              Digitale Infrastruktur,
              <span className="block text-zinc-500">die skaliert.</span>
              <span className="mt-3 block text-[0.43em] font-medium leading-[1.08] tracking-[-0.035em] text-zinc-200 sm:mt-5">
                Wir ersetzen manuelles Chaos durch intelligente Systeme.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-10 max-w-2xl"
            >
              <p className="text-balance text-lg leading-relaxed text-zinc-400 sm:text-xl">
                High-End Webdesign, conversion-starkes Shopify & AI-Automation
                aus einer Hand.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
                Für Energieanbieter, EV-Infrastruktur in Expansionsmärkten und
                Tech-Brands mit ambitionierten Android-Launches.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.a
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.985 }}
                href="#booking"
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-signal px-7 text-sm font-semibold text-black shadow-signal transition-shadow hover:shadow-[0_0_50px_rgba(199,255,74,.18)] sm:w-auto sm:text-base"
              >
                Kostenlose Potenzial-Analyse buchen
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </motion.a>
              <a
                href="#services"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/[0.04] hover:text-white sm:w-auto sm:text-base"
              >
                System ansehen
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mx-auto mt-16 grid max-w-3xl grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-4 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600 sm:text-[10px]"
            >
              <span>Web · Commerce · AI</span>
              <span>DE · MA · Remote</span>
              <span>B2B Systems only</span>
            </motion.div>
          </div>
        </section>

        <div id="content">
          <section
            id="services"
            className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
          >
            <div className="mx-auto max-w-[1440px]">
              <Reveal>
                <SectionLabel>Die 3 Säulen</SectionLabel>
                <div className="mb-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                  <h2 className="text-balance text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl lg:text-7xl">
                    Kein Flickwerk.
                    <span className="block text-zinc-600">Ein Betriebssystem.</span>
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-zinc-400 lg:justify-self-end lg:text-lg">
                    Strategie, Design und Technik werden von Anfang an als ein
                    kommerzielles System gebaut — nicht als lose Sammlung schöner
                    Screens.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Reveal key={service.title} delay={index * 0.08}>
                      <motion.article
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950 p-7 transition-colors hover:border-signal/30 sm:p-8"
                      >
                        <div
                          className="absolute -right-16 -top-16 size-48 rounded-full bg-signal/0 blur-3xl transition-colors group-hover:bg-signal/[0.07]"
                          aria-hidden="true"
                        />
                        <div className="relative flex items-center justify-between">
                          <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-signal">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <span className="font-mono text-xs text-zinc-700">
                            {service.number} / 03
                          </span>
                        </div>
                        <div className="relative mt-auto pt-16">
                          <h3 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {service.title}
                          </h3>
                          <p className="mt-5 text-[15px] leading-7 text-zinc-400">
                            {service.copy}
                          </p>
                          <p className="mt-7 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600 transition-colors group-hover:text-signal/70">
                            {service.outcome}
                          </p>
                        </div>
                      </motion.article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="relative border-y border-white/10 bg-paper px-5 py-24 text-black sm:px-8 sm:py-32 lg:px-12">
            <div
              className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:56px_56px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-[1440px]">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24">
                  <div>
                    <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      <span className="h-px w-8 bg-black" aria-hidden="true" />
                      Unfair Advantage
                    </div>
                    <h2 className="text-balance text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl lg:text-7xl">
                      Drei Disziplinen.
                      <span className="block text-zinc-400">Eine Verantwortung.</span>
                    </h2>
                    <p className="mt-8 max-w-2xl text-balance text-xl font-medium leading-relaxed text-zinc-700 sm:text-2xl">
                      Warum drei Agenturen beauftragen, wenn du das gesamte
                      Ökosystem aus Design, Shop und KI-Gehirn aus einer Hand
                      bekommst?
                    </p>
                  </div>

                  <div className="divide-y divide-black/15 border-y border-black/15">
                    {advantages.map((advantage, index) => {
                      const Icon = advantage.icon;
                      return (
                        <div
                          key={advantage.title}
                          className="grid grid-cols-[auto_1fr] gap-5 py-7 sm:gap-7"
                        >
                          <span className="grid size-11 place-items-center rounded-full bg-black text-signal">
                            <Icon className="size-[18px]" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="flex items-baseline justify-between gap-4">
                              <h3 className="text-lg font-semibold sm:text-xl">
                                {advantage.title}
                              </h3>
                              <span className="font-mono text-[10px] text-zinc-400">
                                0{index + 1}
                              </span>
                            </div>
                            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-600 sm:text-base">
                              {advantage.copy}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section
            id="blueprint"
            className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
          >
            <div
              className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-signal/[0.045] blur-[120px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-24">
              <Reveal className="relative mx-auto w-full max-w-lg lg:mx-0">
                <div
                  className="absolute -inset-8 rounded-[3rem] border border-signal/10 bg-signal/[0.025] blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative -rotate-2 rounded-[1.5rem] border border-white/10 bg-zinc-900 p-4 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:p-5">
                  <div className="rounded-[1.1rem] bg-[#e8e8df] p-6 text-black sm:p-9">
                    <div className="flex items-center justify-between border-b border-black/15 pb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                      <span>Westmonks / Field Guide 01</span>
                      <span>2026</span>
                    </div>
                    <div className="pt-16 sm:pt-24">
                      <span className="inline-flex items-center rounded-full bg-black px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-signal">
                        12 Seiten · 1.5 MB
                      </span>
                      <h3 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-tighter sm:text-5xl">
                        Der Automatisierungs-
                        <span className="text-zinc-500">Blueprint.</span>
                      </h3>
                      <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-600">
                        Vom manuellen Engpass zum messbaren Operating System — in
                        30 Tagen.
                      </p>
                    </div>
                    <div className="mt-16 flex items-end justify-between border-t border-black/15 pt-5 sm:mt-24">
                      <div className="grid size-12 place-items-center rounded-full bg-signal">
                        <Download className="size-5" aria-hidden="true" />
                      </div>
                      <span className="text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                        Web · Commerce
                        <br />AI Operations
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <SectionLabel>Lead Magnet</SectionLabel>
                <h2 className="text-balance text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl">
                  Finde die Prozesse, die
                  <span className="block text-zinc-600">dich jeden Monat Geld kosten.</span>
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                  Der Automatisierungs-Blueprint ist für B2B-Entscheider bewusst
                  extrem kompakt gehalten — exakt <strong className="font-medium text-white">1.5 MB</strong>.
                  Dadurch lässt er sich fehlerfrei im Inkognito-Modus herunterladen
                  und direkt als Featured Document im eigenen LinkedIn-Profil
                  hochladen.
                </p>

                <ul className="mt-8 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                  {[
                    "15-Minuten Prozess-Audit",
                    "30-Tage Implementierungsplan",
                    "KPI- und Tool-Matrix",
                    "Playbooks für Energie & Tech",
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
                  aria-label="Automatisierungs-Blueprint anfordern"
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
                      placeholder="name@unternehmen.de"
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
                      {downloadState === "loading" ? "Wird vorbereitet …" : "Jetzt anfordern"}
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
                      {downloadState === "error" && "Download fehlgeschlagen. Bitte erneut versuchen."}
                    </p>
                  </div>
                </form>
              </Reveal>
            </div>
          </section>

          <section
            id="booking"
            className="border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
          >
            <div className="mx-auto max-w-[1440px]">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
                  <div className="lg:sticky lg:top-28 lg:self-start">
                    <SectionLabel>Potenzial-Analyse</SectionLabel>
                    <h2 className="text-balance text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl lg:text-7xl">
                      Bereit für ein System,
                      <span className="block text-zinc-600">das wirklich funktioniert?</span>
                    </h2>
                    <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                      In 30 Minuten identifizieren wir den teuersten digitalen
                      Engpass, den schnellsten Hebel und den sinnvollsten nächsten
                      Schritt. Klar, direkt und ohne Standard-Pitch.
                    </p>

                    <div className="mt-10 space-y-4 border-t border-white/10 pt-7 text-sm text-zinc-400">
                      {[
                        "30 Minuten, remote",
                        "Konkrete Engpass-Analyse",
                        "Klare Build-or-Buy-Empfehlung",
                      ].map((item) => (
                        <p key={item} className="flex items-center gap-3">
                          <span className="size-1.5 rounded-full bg-signal" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="relative min-h-[680px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950 shadow-2xl">
                    <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600 sm:px-7">
                      <span>Secure booking environment</span>
                      <span className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_rgba(199,255,74,.75)]" />
                        Live
                      </span>
                    </div>

                    <iframe
                      title="Calendly — Kostenlose Potenzial-Analyse buchen"
                      src={calendlyUrl || "about:blank"}
                      loading="lazy"
                      className="h-[626px] w-full bg-zinc-950"
                      allow="camera; microphone; fullscreen; payment"
                    />

                    {!calendlyUrl && (
                      <div className="absolute inset-x-0 bottom-0 top-14 grid place-items-center bg-zinc-950 px-6 text-center">
                        <div className="max-w-md">
                          <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-signal/20 bg-signal/[0.06] text-signal">
                            <ArrowRight className="size-5" aria-hidden="true" />
                          </span>
                          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                            Calendly ist vorbereitet.
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-zinc-500">
                            Hinterlege deine Event-URL als
                            <code className="mx-1 rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                              NEXT_PUBLIC_CALENDLY_URL
                            </code>
                            in Vercel. Der Kalender erscheint danach automatisch
                            an dieser Stelle.
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

        <footer className="border-t border-white/10 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
              <span className="font-semibold tracking-[0.16em] text-zinc-300">
                WESTMONKS
              </span>
              <span>© 2026</span>
            </div>
            <p className="font-mono uppercase tracking-[0.14em]">
              Built for measurable growth
            </p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}
