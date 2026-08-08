"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CircleAlert,
  Copy,
  Headphones,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MoveUpRight,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const logoUrl =
  "https://res.cloudinary.com/kpcyenmx/image/upload/f_auto,q_auto/westmonks-logo-transparent_lzgn9i";

const modules: Array<{
  icon: LucideIcon;
  number: string;
  title: string;
  copy: string;
  result: string;
}> = [
  {
    icon: ReceiptText,
    number: "01",
    title: "Financial Sync",
    copy: "Bestellungen, Rechnungen und Bestände laufen automatisch zusammen — nachvollziehbar, fehlerarm und ohne manuelle Exporte.",
    result: "Orders → Finance → Bestand",
  },
  {
    icon: Headphones,
    number: "02",
    title: "Autonomous Support",
    copy: "Wiederkehrende Kundenanfragen, Retouren und Statusabfragen werden sofort eingeordnet und zuverlässig bearbeitet.",
    result: "Anfrage → Entscheidung → Antwort",
  },
  {
    icon: Workflow,
    number: "03",
    title: "Operations Core",
    copy: "Individuelle Fulfillment- und Backoffice-Prozesse werden zu einem belastbaren System, das mit deinem Store mitwächst.",
    result: "Ereignis → Regel → Ausführung",
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
      <Check className="size-3.5" aria-hidden="true" />
      {children}
    </span>
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
  const [inquiryState, setInquiryState] = useState<
    "idle" | "copied" | "opened" | "error"
  >("idle");

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (analysisState === "loading") return;

    setAnalysisState("loading");
    setAnalysis(null);
    setAnalysisError("");
    setInquiryState("idle");

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

  async function handleInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!analysis) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const subject = `Projektanfrage von ${name} · ${analysis.shopName}`;
    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Shop: ${analysis.analyzedUrl}`,
      `Erkannter Engpass: ${analysis.primaryBottleneck.title}`,
      `Geschätztes Potenzial: ${analysis.estimatedManualHoursPerMonth.minimum}–${analysis.estimatedManualHoursPerMonth.maximum} Std./Monat`,
      "",
      message || "Ich möchte den erkannten Engpass mit Westmonks besprechen.",
    ].join("\n");

    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setInquiryState("opened");
      return;
    }

    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setInquiryState("copied");
    } catch {
      setInquiryState("error");
    }
  }

  function resetAnalysis() {
    setAnalysisState("idle");
    setAnalysis(null);
    setAnalysisError("");
    setInquiryState("idle");
  }

  return (
    <MotionConfig reducedMotion="user">
      <main id="main" className="min-h-screen overflow-hidden bg-white text-zinc-950">
        <a
          href="#analyse"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          Zur Potenzialanalyse springen
        </a>

        <header className="relative z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a
              href="#main"
              className="relative block h-9 w-[146px] overflow-hidden sm:w-[170px]"
              aria-label="Westmonks Startseite"
            >
              <Image
                src={logoUrl}
                alt="Westmonks"
                fill
                priority
                sizes="(min-width: 640px) 170px, 146px"
                className="scale-[1.7] object-contain brightness-0"
              />
            </a>

            <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
              <a className="transition-colors hover:text-emerald-700" href="#analyse">
                Potenzialanalyse
              </a>
              <a className="transition-colors hover:text-emerald-700" href="#module">
                Systemmodule
              </a>
            </nav>

            <a
              href="#analyse"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(5,150,105,.18)] transition-colors hover:bg-emerald-700"
            >
              <span className="hidden sm:inline">Shop prüfen</span>
              <span className="sm:hidden">Analyse</span>
              <MoveUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </header>

        <section className="relative border-b border-zinc-200 bg-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,.13),transparent_28%),linear-gradient(to_right,rgba(24,24,27,.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,.035)_1px,transparent_1px)] bg-[size:auto,56px_56px,56px_56px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.06fr_.94fr] lg:items-center lg:px-12 lg:py-32">
            <div className="max-w-[780px]">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-30" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                </span>
                Shopify Operations Engineering
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance text-[clamp(3.2rem,6.5vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.06em] text-zinc-950"
              >
                Dein Store wächst.
                <span className="block text-emerald-600">Dein Aufwand nicht.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12 }}
                className="mt-8 max-w-2xl text-balance text-lg leading-8 text-zinc-600 sm:text-xl"
              >
                Wir verwandeln manuelle Shopify-Abläufe in ein klares,
                belastbares Betriebssystem — als maßgeschneidertes Setup, das
                deinem Unternehmen gehört.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <a
                  href="#analyse"
                  className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-emerald-600 px-7 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(5,150,105,.2)] transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Potenzial kostenlos prüfen
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#module"
                  className="inline-flex min-h-14 items-center rounded-full border border-zinc-300 bg-white px-7 text-sm font-semibold text-zinc-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                >
                  System ansehen
                </a>
              </motion.div>

              <div className="mt-9 flex flex-wrap gap-3">
                <StatusPill>Kein Shop-Login</StatusPill>
                <StatusPill>Sichere Server-Analyse</StatusPill>
                <StatusPill>Fixes Setup statt Lock-in</StatusPill>
              </div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[530px] rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-[0_40px_100px_rgba(24,24,27,.1)] lg:justify-self-end"
            >
              <div className="rounded-[1.55rem] bg-zinc-950 p-5 text-white sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400">OPERATIONS STATUS</p>
                    <p className="mt-1 text-sm text-zinc-400">Autonome Abläufe</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    <span className="size-2 rounded-full bg-emerald-400" /> Aktiv
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    [ReceiptText, "Bestellung erfasst", "Rechnung synchron"],
                    [RefreshCw, "Bestand geändert", "Systeme abgeglichen"],
                    [PackageCheck, "Retoure angefragt", "Vorgang vorbereitet"],
                  ].map(([Icon, label, status], index) => {
                    const FlowIcon = Icon as LucideIcon;
                    return (
                      <motion.div
                        key={String(label)}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.1 }}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                      >
                        <span className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                          <FlowIcon className="size-4" />
                        </span>
                        <span className="text-sm font-medium text-zinc-200">{String(label)}</span>
                        <span className="text-right text-xs text-zinc-500">{String(status)}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.055] p-4">
                    <p className="text-2xl font-semibold tracking-tight">24/7</p>
                    <p className="mt-1 text-xs text-zinc-500">Systembetrieb</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-400 p-4 text-zinc-950">
                    <p className="text-2xl font-semibold tracking-tight">100%</p>
                    <p className="mt-1 text-xs font-medium text-emerald-950/70">Dein Eigentum</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        <section id="analyse" className="scroll-mt-8 bg-zinc-50 py-20 sm:py-28">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                Live-Potenzialanalyse
              </span>
              <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-6xl">
                Wo verliert dein Store heute Zeit?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
                Gib deine öffentliche Shop-URL ein. Westmonks erkennt sichtbare
                operative Signale und verdichtet sie zu einem klaren ersten Hebel.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(24,24,27,.07)]">
                <div className="grid lg:grid-cols-[.82fr_1.18fr]">
                  <div className="border-b border-zinc-200 p-6 sm:p-9 lg:border-b-0 lg:border-r">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Sparkles className="size-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-950">Shop-Check starten</p>
                        <p className="text-sm text-zinc-500">Ergebnis in wenigen Sekunden</p>
                      </div>
                    </div>

                    <form className="mt-8" onSubmit={handleAnalyze}>
                      <label
                        htmlFor="shop-url"
                        className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500"
                      >
                        Shopify-Shop-URL
                      </label>
                      <div className="mt-3 rounded-2xl border border-zinc-300 bg-white p-2 transition-shadow focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                        <div className="flex min-h-14 items-center gap-3 px-3">
                          <LockKeyhole className="size-4 shrink-0 text-emerald-600" />
                          <input
                            id="shop-url"
                            name="shop-url"
                            type="text"
                            inputMode="url"
                            autoComplete="url"
                            required
                            maxLength={300}
                            value={shopUrl}
                            onChange={(event) => setShopUrl(event.target.value)}
                            placeholder="deinshop.de"
                            className="min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400"
                            aria-describedby="shop-url-help"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: analysisState === "loading" ? 1 : 1.01 }}
                          whileTap={{ scale: analysisState === "loading" ? 1 : 0.99 }}
                          disabled={analysisState === "loading"}
                          className="mt-2 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:bg-emerald-500"
                          type="submit"
                        >
                          {analysisState === "loading" ? (
                            <>
                              <LoaderCircle className="size-4 animate-spin" />
                              Shopdaten werden sicher ausgewertet…
                            </>
                          ) : (
                            <>
                              Engpass analysieren
                              <Sparkles className="size-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                      <p id="shop-url-help" className="mt-4 flex gap-2 text-sm leading-6 text-zinc-500">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        Nur öffentlich sichtbare Informationen. Kein Login, kein Zugriff auf interne Shopdaten.
                      </p>
                    </form>
                  </div>

                  <div className="relative min-h-[470px] bg-emerald-50/40 p-6 sm:p-9">
                    <AnimatePresence mode="wait">
                      {analysisState === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex min-h-[398px] flex-col items-center justify-center text-center"
                        >
                          <span className="grid size-20 place-items-center rounded-[1.6rem] border border-emerald-200 bg-white text-emerald-600 shadow-sm">
                            <Bot className="size-8" />
                          </span>
                          <h3 className="mt-7 text-2xl font-semibold tracking-tight text-zinc-950">
                            Dein erster Operations-Hebel.
                          </h3>
                          <p className="mt-3 max-w-md leading-7 text-zinc-600">
                            Du erhältst eine konservative Zeitschätzung, den wahrscheinlichsten Engpass und einen konkreten nächsten Schritt.
                          </p>
                        </motion.div>
                      )}

                      {analysisState === "loading" && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex min-h-[398px] flex-col items-center justify-center text-center"
                        >
                          <div className="relative grid size-28 place-items-center rounded-full border border-emerald-200 bg-white shadow-sm">
                            <motion.span
                              className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }}
                            />
                            <Workflow className="size-8 text-emerald-600" />
                          </div>
                          <h3 className="mt-7 text-2xl font-semibold text-zinc-950">
                            Shopdaten werden ausgewertet…
                          </h3>
                          <p className="mt-3 max-w-sm leading-7 text-zinc-600">
                            Wir prüfen sichtbare Abläufe und verdichten sie zu einem belastbaren ersten Ansatzpunkt.
                          </p>
                        </motion.div>
                      )}

                      {analysisState === "error" && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex min-h-[398px] flex-col items-center justify-center text-center"
                          role="alert"
                        >
                          <span className="grid size-20 place-items-center rounded-[1.6rem] border border-rose-200 bg-rose-50 text-rose-600">
                            <CircleAlert className="size-8" />
                          </span>
                          <h3 className="mt-7 text-2xl font-semibold text-zinc-950">
                            Analyse nicht abgeschlossen.
                          </h3>
                          <p className="mt-3 max-w-md leading-7 text-zinc-600">{analysisError}</p>
                          <button
                            type="button"
                            onClick={resetAnalysis}
                            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                          >
                            <RotateCcw className="size-4" /> Erneut versuchen
                          </button>
                        </motion.div>
                      )}

                      {analysisState === "success" && analysis && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                              <Check className="size-3.5" /> Analyse abgeschlossen
                            </span>
                            <span className="text-xs font-medium text-zinc-500">
                              {confidenceLabel[analysis.confidence]}
                            </span>
                          </div>

                          <p className="mt-6 text-sm font-medium text-zinc-500">{analysis.shopName}</p>
                          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-zinc-950">
                            {analysis.primaryBottleneck.title}
                          </h3>
                          <p className="mt-4 leading-7 text-zinc-600">
                            {analysis.primaryBottleneck.diagnosis}
                          </p>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-emerald-200 bg-white p-5">
                              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                                Potenzial / Monat
                              </p>
                              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                                {analysis.estimatedManualHoursPerMonth.minimum}–{analysis.estimatedManualHoursPerMonth.maximum} Std.
                              </p>
                            </div>
                            <div className="rounded-2xl bg-emerald-600 p-5 text-white">
                              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">
                                Erster Hebel
                              </p>
                              <p className="mt-2 text-sm leading-6 text-white">
                                {analysis.recommendedAutomation}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={resetAnalysis}
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-emerald-700"
                          >
                            <RotateCcw className="size-4" /> Anderen Shop prüfen
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {analysisState === "success" && analysis && (
                    <motion.div
                      id="anfrage"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-zinc-200 bg-white"
                    >
                      <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                            Nächster Schritt
                          </span>
                          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-zinc-950">
                            Den Engpass sauber beseitigen.
                          </h3>
                          <p className="mt-4 leading-7 text-zinc-600">
                            Kein Standardpaket und kein langfristiger Tool-Vertrag. Du erhältst ein klar abgegrenztes, fixes Setup für deinen tatsächlichen Prozess.
                          </p>
                          <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                            {["Individuelle Systemarchitektur", "Aufbau in deinem Workspace", "Saubere Übergabe ohne Lock-in"].map((item) => (
                              <li key={item} className="flex items-center gap-3">
                                <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                                  <Check className="size-3.5" />
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <form onSubmit={handleInquiry} className="rounded-[1.6rem] border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-sm font-semibold text-zinc-800">Name</span>
                              <input
                                name="name"
                                required
                                autoComplete="name"
                                maxLength={120}
                                className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-zinc-950 outline-none transition-shadow focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                placeholder="Dein Name"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-semibold text-zinc-800">E-Mail</span>
                              <input
                                name="email"
                                type="email"
                                inputMode="email"
                                required
                                autoComplete="email"
                                maxLength={254}
                                className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-zinc-950 outline-none transition-shadow focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                placeholder="name@unternehmen.de"
                              />
                            </label>
                          </div>
                          <label className="mt-4 block">
                            <span className="text-sm font-semibold text-zinc-800">
                              Kontext <span className="font-normal text-zinc-400">(optional)</span>
                            </span>
                            <textarea
                              name="message"
                              rows={4}
                              maxLength={1200}
                              className="mt-2 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-shadow focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                              placeholder="Was kostet dein Team aktuell am meisten Zeit?"
                            />
                          </label>
                          <button
                            type="submit"
                            className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                          >
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? <Send className="size-4" /> : <Copy className="size-4" />}
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? "Projektanfrage senden" : "Projektanfrage kopieren"}
                          </button>
                          <div aria-live="polite" className="mt-3 min-h-6 text-sm text-zinc-500">
                            {inquiryState === "opened" && "Deine E-Mail-App wurde mit allen Angaben geöffnet."}
                            {inquiryState === "copied" && "Anfrage kopiert. Du kannst sie jetzt in deinem bevorzugten Kontaktkanal einfügen."}
                            {inquiryState === "error" && "Kopieren war nicht möglich. Bitte markiere deine Angaben manuell."}
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="module" className="scroll-mt-8 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <Reveal className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Das Shopify-Betriebssystem
                </span>
                <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-6xl">
                  Drei Module. Ein sauberer Betrieb.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 lg:justify-self-end">
                Die Module greifen ineinander, werden aber nur dort eingesetzt, wo sie messbar manuelle Arbeit reduzieren. Kein überladenes Paket, kein unnötiger Dauerbetrieb.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Reveal key={module.title} delay={index * 0.08}>
                    <article className="group flex min-h-[360px] flex-col rounded-[1.8rem] border border-zinc-200 bg-white p-6 shadow-[0_16px_50px_rgba(24,24,27,.045)] transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_60px_rgba(5,150,105,.1)] sm:p-8">
                      <div className="flex items-center justify-between">
                        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                          <Icon className="size-6" />
                        </span>
                        <span className="font-mono text-xs text-zinc-400">{module.number}</span>
                      </div>
                      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-950">{module.title}</h3>
                      <p className="mt-4 leading-7 text-zinc-600">{module.copy}</p>
                      <div className="mt-auto pt-8">
                        <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-600">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          {module.result}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-10 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-bold text-emerald-700">Build vs. Run</p>
                  <h3 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                    Wir bauen in deinem Workspace. Das System gehört zu 100 % dir.
                  </h3>
                  <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
                    Keine Support-Falle und kein versteckter Lock-in. Falls du den laufenden Betrieb absichern willst, ergänzen wir ihn modular und transparent.
                  </p>
                </div>
                <a
                  href="#analyse"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-emerald-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Eigenen Shop prüfen
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-zinc-200 bg-zinc-50 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-8 w-[118px] overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="Westmonks"
                  fill
                  sizes="118px"
                  className="scale-[1.7] object-contain brightness-0"
                />
              </div>
              <span>© 2026</span>
            </div>
            <p>Shopify Operations · Automation · Ownership</p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}
