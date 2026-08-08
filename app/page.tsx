"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  CircleAlert,
  Headphones,
  LockKeyhole,
  MoveUpRight,
  Radar,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
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

type ConfidenceLevel = "hoch" | "mittel" | "niedrig";

type AnalysisResult = {
  analyzedUrl: string;
  shopName: string;
  shopifyLikelihood: ConfidenceLevel;
  estimatedManualHoursPerMonth: {
    minimum: number;
    maximum: number;
  };
  primaryBottleneck: {
    category: string;
    title: string;
    diagnosis: string;
  };
  recommendedAutomation: string;
  publicSignals: string[];
  confidence: ConfidenceLevel;
  disclaimer: string;
};

type AnalyzeResponse =
  | {
      ok: true;
      requestId: string;
      data: AnalysisResult;
      meta: { analyzedAt: string; cached: boolean };
    }
  | {
      ok: false;
      requestId: string;
      error: { code: string; message: string };
    };

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

const confidenceLabel: Record<ConfidenceLevel, string> = {
  hoch: "Hohe Sicherheit",
  mittel: "Mittlere Sicherheit",
  niedrig: "Niedrige Sicherheit",
};

export default function Home() {
  const [shopUrl, setShopUrl] = useState("");
  const [analysisState, setAnalysisState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (analysisState === "loading") return;

    setAnalysisState("loading");
    setAnalysis(null);
    setAnalysisError("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 32_000);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shopUrl.trim() }),
        signal: controller.signal,
      });
      const payload = (await response.json()) as AnalyzeResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.ok
            ? "Die Analyse konnte nicht abgeschlossen werden."
            : payload.error.message,
        );
      }

      setAnalysis(payload.data);
      setAnalysisState("success");
    } catch (error) {
      const timedOut =
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError");

      setAnalysisError(
        timedOut
          ? "Die Analyse hat zu lange gedauert. Bitte versuche es erneut."
          : error instanceof Error
            ? error.message
            : "Die Analyse konnte nicht gestartet werden.",
      );
      setAnalysisState("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function resetAnalysis() {
    setAnalysisState("idle");
    setAnalysis(null);
    setAnalysisError("");
    setShopUrl("");
  }

  return (
    <MotionConfig reducedMotion="user">
      <main id="main" className="noise overflow-hidden bg-ink text-paper">
        <a
          href="#analyse"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-black transition-transform focus:translate-y-0"
        >
          Zur Shop-Analyse springen
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
              <a className="transition-colors hover:text-white" href="#analyse">
                AI-Analyse
              </a>
              <a className="transition-colors hover:text-white" href="#system">
                Betriebssystem
              </a>
            </nav>

            <a
              href="#analyse"
              className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 text-xs font-medium text-white backdrop-blur-xl transition-colors hover:border-signal/50 hover:bg-signal hover:text-black sm:px-5 sm:text-sm"
            >
              <span className="hidden sm:inline">Shop analysieren</span>
              <span className="sm:hidden">AI-Check</span>
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
                übernehmen.{" "}
                <strong className="font-medium text-white">
                  Ohne Personalaufwand.
                </strong>
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
                  href="#analyse"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-signal px-7 text-sm font-semibold text-black shadow-signal transition-shadow hover:shadow-[0_0_55px_rgba(199,255,74,.2)] sm:text-base"
                >
                  Shop kostenlos analysieren
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
                  "Sichere Server-Analyse",
                  "Kein Shopify-Login",
                  "Ergebnis in Sekunden",
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
                      transition={{
                        duration: 0.55,
                        delay: 0.46 + index * 0.1,
                      }}
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

        <section
          id="analyse"
          className="relative border-b border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        >
          <div
            className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(199,255,74,.45),transparent)]"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/3 size-[620px] -translate-x-1/2 rounded-full bg-signal/[0.035] blur-[150px]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-[1320px]">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
                <div>
                  <SectionKicker index="01">Gemini Operations Scan</SectionKicker>
                  <h2 className="text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[5.4rem]">
                    Finde den teuersten
                    <span className="block text-zinc-600">
                      manuellen Engpass.
                    </span>
                  </h2>
                </div>
                <div className="lg:pb-2">
                  <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                    Gib deine Shop-URL ein. Gemini prüft die öffentliche
                    Storefront, clustert sichtbare Operations-Signale und
                    berechnet dein wahrscheinlich stärkstes
                    Automatisierungspotenzial.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-500">
                    {[
                      "API-Key nur serverseitig",
                      "URL Context",
                      "Rate Limited",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-14">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080808] shadow-[0_35px_120px_rgba(0,0,0,.5)] sm:rounded-[2.25rem]">
                <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-[9px]">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px_rgba(199,255,74,.8)]" />
                    Westmonks / AI Operations Diagnostic
                  </span>
                  <span>Gemini 3.1 Flash-Lite · Secure Server Route</span>
                </div>

                <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
                  <div className="border-b border-white/10 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                    <div className="flex items-start justify-between gap-6">
                      <span className="grid size-12 place-items-center rounded-2xl border border-signal/20 bg-signal/[0.07] text-signal">
                        <Search className="size-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-600">
                        01 URL · 01 Diagnose
                      </span>
                    </div>

                    <h3 className="mt-9 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                      Welche Operation kostet dich jeden Monat Zeit?
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
                      Kein Login, kein App-Zugriff. Die Analyse arbeitet mit
                      öffentlich sichtbaren Storefront-Signalen und
                      Shopify-Operations-Mustern.
                    </p>

                    <form
                      className="mt-8"
                      onSubmit={handleAnalyze}
                      aria-label="Shopify-Shop analysieren"
                    >
                      <label
                        htmlFor="shop-url"
                        className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500"
                      >
                        Shopify-Shop-URL
                      </label>
                      <div className="mt-3 rounded-[1.3rem] border border-white/10 bg-black/45 p-2 transition-colors focus-within:border-signal/40">
                        <div className="flex min-h-14 items-center gap-3 px-3">
                          <LockKeyhole
                            className="size-4 shrink-0 text-signal"
                            aria-hidden="true"
                          />
                          <span className="hidden text-sm text-zinc-700 sm:inline">
                            https://
                          </span>
                          <input
                            id="shop-url"
                            name="url"
                            type="text"
                            inputMode="url"
                            autoComplete="url"
                            spellCheck={false}
                            required
                            maxLength={300}
                            value={shopUrl}
                            onChange={(event) => setShopUrl(event.target.value)}
                            placeholder="deinshop.de"
                            aria-describedby="analysis-note analysis-status"
                            className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-zinc-700 focus:outline-none"
                          />
                        </div>
                        <motion.button
                          whileHover={
                            analysisState === "loading" ? undefined : { scale: 1.01 }
                          }
                          whileTap={
                            analysisState === "loading"
                              ? undefined
                              : { scale: 0.985 }
                          }
                          type="submit"
                          disabled={analysisState === "loading"}
                          className="group mt-2 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-signal px-6 text-sm font-semibold text-black transition-colors hover:bg-[#d4ff72] disabled:cursor-wait disabled:opacity-80 sm:text-base"
                        >
                          {analysisState === "loading" ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                                className="size-4 rounded-full border-2 border-black/25 border-t-black"
                                aria-hidden="true"
                              />
                              Analyse läuft
                            </>
                          ) : (
                            <>
                              Engpass analysieren
                              <Sparkles
                                className="size-4 transition-transform group-hover:rotate-6 group-hover:scale-110"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </motion.button>
                      </div>
                      <p
                        id="analysis-note"
                        className="mt-3 flex items-start gap-2 text-xs leading-5 text-zinc-600"
                      >
                        <ShieldCheck
                          className="mt-0.5 size-3.5 shrink-0 text-signal"
                          aria-hidden="true"
                        />
                        Deine URL wird ausschließlich über unsere geschützte
                        Server-Route an Gemini gesendet. Kein API-Key im Browser.
                      </p>
                    </form>
                  </div>

                  <div
                    id="analysis-status"
                    className="relative min-h-[530px] bg-black/25 p-5 sm:p-8 lg:p-10"
                    aria-live="polite"
                    aria-busy={analysisState === "loading"}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
                      aria-hidden="true"
                    />

                    <AnimatePresence mode="wait">
                      {analysisState === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="relative flex min-h-[470px] flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                              Analyse-Engine / Bereit
                            </span>
                            <Radar
                              className="size-5 text-signal/70"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="mx-auto max-w-md text-center">
                            <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] border border-signal/15 bg-signal/[0.045] text-signal">
                              <ScanLine className="size-8" aria-hidden="true" />
                            </span>
                            <h3 className="mt-7 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                              Bereit für den Operations Scan.
                            </h3>
                            <p className="mt-4 text-sm leading-6 text-zinc-500">
                              Nach der Analyse siehst du eine realistische
                              Stundenspanne, den wahrscheinlichsten Engpass und
                              den sinnvollsten ersten Workflow.
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
                            {["Storefront", "Engpass", "Potenzial"].map(
                              (item, index) => (
                                <div
                                  key={item}
                                  className="bg-[#090909] px-2 py-4 text-center"
                                >
                                  <p className="font-mono text-[8px] text-signal">
                                    0{index + 1}
                                  </p>
                                  <p className="mt-1 text-[10px] text-zinc-600 sm:text-xs">
                                    {item}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}

                      {analysisState === "loading" && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative flex min-h-[470px] flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">
                              Live Processing
                            </span>
                            <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-600">
                              <span className="size-1.5 animate-pulse rounded-full bg-signal" />
                              Secure
                            </span>
                          </div>

                          <div className="my-auto text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 7,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="relative mx-auto size-28 rounded-full border border-dashed border-signal/35"
                            >
                              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_18px_rgba(199,255,74,.9)]" />
                            </motion.div>
                            <Sparkles
                              className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-signal"
                              aria-hidden="true"
                            />
                            <h3 className="mt-8 text-balance text-2xl font-semibold tracking-[-0.03em] text-white">
                              Analysiere Shopify-Backend via Gemini AI...
                            </h3>
                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-600">
                              Öffentliche Storefront wird gelesen. Interne Daten
                              bleiben unangetastet.
                            </p>
                          </div>

                          <div className="space-y-2">
                            {[
                              "Storefront-Signale erfassen",
                              "Operations-Muster clustern",
                              "Automationspotenzial berechnen",
                            ].map((item, index) => (
                              <motion.div
                                key={item}
                                initial={{ opacity: 0.35 }}
                                animate={{ opacity: [0.35, 1, 0.35] }}
                                transition={{
                                  duration: 1.8,
                                  delay: index * 0.35,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
                              >
                                <span className="grid size-6 place-items-center rounded-full bg-signal/[0.08] font-mono text-[8px] text-signal">
                                  0{index + 1}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {item}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {analysisState === "error" && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="relative flex min-h-[470px] flex-col items-center justify-center text-center"
                          role="alert"
                        >
                          <span className="grid size-16 place-items-center rounded-2xl border border-red-400/20 bg-red-400/[0.06] text-red-300">
                            <CircleAlert className="size-6" aria-hidden="true" />
                          </span>
                          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                            Analyse nicht abgeschlossen.
                          </h3>
                          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                            {analysisError}
                          </p>
                          <button
                            type="button"
                            onClick={() => setAnalysisState("idle")}
                            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-signal/30 hover:text-white"
                          >
                            <RotateCcw className="size-4" aria-hidden="true" />
                            Erneut versuchen
                          </button>
                        </motion.div>
                      )}

                      {analysisState === "success" && analysis && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="relative"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-signal">
                                Analyse abgeschlossen
                              </p>
                              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                                {analysis.shopName}
                              </h3>
                              <p className="mt-1 truncate text-xs text-zinc-600">
                                {analysis.analyzedUrl}
                              </p>
                            </div>
                            <span className="w-fit rounded-full border border-signal/20 bg-signal/[0.06] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-signal">
                              {confidenceLabel[analysis.confidence]}
                            </span>
                          </div>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-signal/15 bg-signal/[0.05] p-5">
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-600">
                                Geschätztes Potenzial
                              </p>
                              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                                {
                                  analysis.estimatedManualHoursPerMonth
                                    .minimum
                                }
                                –
                                {
                                  analysis.estimatedManualHoursPerMonth
                                    .maximum
                                }
                                <span className="ml-2 text-base font-medium tracking-normal text-zinc-500">
                                  Std. / Monat
                                </span>
                              </p>
                            </div>
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-600">
                                Shopify-Wahrscheinlichkeit
                              </p>
                              <p className="mt-3 text-2xl font-semibold capitalize tracking-[-0.03em] text-white">
                                {analysis.shopifyLikelihood}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-600">
                                Primärer Engpass
                              </p>
                              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.13em] text-zinc-500">
                                {analysis.primaryBottleneck.category}
                              </span>
                            </div>
                            <h4 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white">
                              {analysis.primaryBottleneck.title}
                            </h4>
                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                              {analysis.primaryBottleneck.diagnosis}
                            </p>
                          </div>

                          <div className="mt-3 rounded-2xl bg-signal p-5 text-black">
                            <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-black/50">
                              Empfohlener erster Workflow
                            </p>
                            <p className="mt-3 text-sm font-medium leading-6">
                              {analysis.recommendedAutomation}
                            </p>
                          </div>

                          <div className="mt-5">
                            <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-zinc-600">
                              Öffentliche Signale
                            </p>
                            <ul className="mt-3 space-y-2">
                              {analysis.publicSignals.map((signal) => (
                                <li
                                  key={signal}
                                  className="flex items-start gap-2 text-xs leading-5 text-zinc-500"
                                >
                                  <Check
                                    className="mt-0.5 size-3.5 shrink-0 text-signal"
                                    aria-hidden="true"
                                  />
                                  {signal}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="mt-5 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-zinc-700">
                            {analysis.disclaimer}
                          </p>

                          <button
                            type="button"
                            onClick={resetAnalysis}
                            className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-white"
                          >
                            <RotateCcw className="size-3.5" aria-hidden="true" />
                            Anderen Shop analysieren
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="system"
          className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        >
          <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:h-fit">
              <SectionKicker index="02">Die Kern-Engine</SectionKicker>
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
                  <ArrowRight
                    className="size-3.5 text-signal"
                    aria-hidden="true"
                  />
                  <span>Orchestration</span>
                  <ArrowRight
                    className="size-3.5 text-signal"
                    aria-hidden="true"
                  />
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
                              <Icon
                                className="size-5 sm:size-6"
                                aria-hidden="true"
                              />
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
                          <div
                            className="hidden items-center gap-1 sm:flex"
                            aria-hidden="true"
                          >
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

        <section className="border-t border-white/10 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <Reveal>
            <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[2rem] border border-signal/15 bg-[#080808] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <div
                className="absolute -right-32 -top-32 size-[420px] rounded-full bg-signal/[0.09] blur-[100px]"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(90deg,black,transparent)]"
                aria-hidden="true"
              />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <SectionKicker index="03">Der nächste Schritt</SectionKicker>
                  <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                    Automatisiere nicht alles.
                    <span className="block text-zinc-600">
                      Automatisiere das Richtige.
                    </span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                    Starte mit einer belastbaren Hypothese. Wir bauen das
                    passende System anschließend in deinem Workspace — sauber
                    dokumentiert und zu 100% in deinem Besitz.
                  </p>
                </div>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  href="#analyse"
                  className="group inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-full bg-signal px-7 text-sm font-semibold text-black shadow-signal sm:text-base"
                >
                  Shop jetzt analysieren
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.a>
              </div>

              <div className="relative mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-xs text-zinc-600">
                {[
                  "Keine Support-Falle",
                  "Kein versteckter Lock-in",
                  "Optionaler SLA-Betrieb",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-signal" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

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
