"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  DatabaseZap,
  FileCheck2,
  Headphones,
  LineChart,
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
  featured?: boolean;
}> = [
  {
    icon: ReceiptText,
    number: "01",
    title: "Financial Sync",
    copy: "Bestellungen, Rechnungen und Bestände laufen automatisch zusammen — nachvollziehbar und ohne manuelle Exporte.",
    result: "Orders → Finance → Bestand",
  },
  {
    icon: Headphones,
    number: "02",
    title: "Autonomous Support",
    copy: "Wiederkehrende Kundenanfragen, Retouren und Statusabfragen werden zuverlässig eingeordnet und bearbeitet.",
    result: "Anfrage → Entscheidung → Antwort",
    featured: true,
  },
  {
    icon: Workflow,
    number: "03",
    title: "Operations Core",
    copy: "Fulfillment- und Backoffice-Prozesse werden zu einem belastbaren System, das mit deinem Store mitwächst.",
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
  ["01", "Audit", "Wir machen sichtbar, wo Zeit, Daten und Verantwortung heute verloren gehen."],
  ["02", "Blueprint", "Wir übersetzen den Prozess in eine klare, belastbare Systemarchitektur."],
  ["03", "Build", "Wir bauen und testen die Automationen direkt in deinem Workspace."],
  ["04", "Launch", "Wir führen kontrolliert ein, dokumentieren und übergeben ohne Blackbox."],
];

const capabilities = [
  [ReceiptText, "Bestellungen"],
  [RefreshCw, "Bestände"],
  [FileCheck2, "Rechnungen"],
  [Headphones, "Support"],
  [PackageCheck, "Fulfillment"],
  [LineChart, "Reporting"],
] as const;

type ConfidenceLevel = "hoch" | "mittel" | "niedrig";

type AnalysisResult = {
  analyzedUrl: string;
  shopName: string;
  shopifyLikelihood: ConfidenceLevel;
  estimatedManualHoursPerMonth: { minimum: number; maximum: number };
  primaryBottleneck: { category: string; title: string; diagnosis: string };
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
      <main id="main" className="min-h-screen overflow-hidden bg-[#d8f4ff] text-zinc-950">
        <a
          href="#analyse"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-[#c9ff3d] px-5 py-3 text-sm font-semibold text-black transition-transform focus:translate-y-0"
        >
          Zur Shop-Analyse springen
        </a>

        <section className="relative p-3 sm:p-5 lg:p-7">
          <div className="relative mx-auto min-h-[760px] max-w-[1500px] overflow-hidden rounded-[1.75rem] border-4 border-white bg-sky-500 shadow-[0_30px_100px_rgba(5,60,90,.2)] sm:min-h-[880px] sm:rounded-[2.5rem]">
            <Image
              src="/westmonks-sky-hero.webp"
              alt="Blauer Himmel über einer grünen Berglandschaft"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,26,46,.08),rgba(0,56,85,.02)_45%,rgba(0,25,18,.38))]" />

            <header className="absolute inset-x-4 top-4 z-20 sm:inset-x-7 sm:top-7 lg:inset-x-10 lg:top-9">
              <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-4 shadow-[0_18px_50px_rgba(6,55,80,.16)] backdrop-blur-xl sm:px-6">
                <a href="#main" className="relative h-8 w-[132px] overflow-hidden" aria-label="Westmonks Startseite">
                  <Image src={logoUrl} alt="Westmonks" fill priority sizes="132px" className="scale-[1.7] object-contain brightness-0" />
                </a>
                <nav className="hidden items-center gap-7 text-xs font-semibold text-zinc-700 md:flex">
                  <a href="#system" className="transition-colors hover:text-black">System</a>
                  <a href="#prozess" className="transition-colors hover:text-black">Prozess</a>
                  <a href="#analyse" className="transition-colors hover:text-black">Analyse</a>
                  <a href="#fragen" className="transition-colors hover:text-black">Fragen</a>
                </nav>
                <a href="#analyse" className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#c9ff3d] pl-4 pr-2 text-xs font-bold text-black shadow-[0_8px_24px_rgba(157,225,0,.25)] transition-transform hover:-translate-y-0.5">
                  <span className="hidden sm:inline">Shop prüfen</span>
                  <span className="sm:hidden">Analyse</span>
                  <span className="grid size-8 place-items-center rounded-lg bg-black text-white">
                    <MoveUpRight className="size-4" />
                  </span>
                </a>
              </div>
            </header>

            <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1050px] flex-col items-center justify-center px-5 pb-24 pt-32 text-center text-white sm:min-h-[880px]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-900 shadow-lg backdrop-blur"
              >
                <span className="size-2 rounded-full bg-[#8edb00]" />
                Shopify Operations — neu gedacht
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[1000px] text-balance text-[clamp(3rem,7vw,7.7rem)] font-semibold leading-[0.88] tracking-[-0.065em] [text-shadow:0_4px_30px_rgba(0,42,70,.3)]"
              >
                Wir bauen das System hinter deinem Shopify-Wachstum.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12 }}
                className="mt-7 max-w-2xl text-balance text-base leading-7 text-white/90 [text-shadow:0_2px_18px_rgba(0,35,60,.35)] sm:text-xl"
              >
                Rechnungen, Bestand, Support und Fulfillment werden zu einem einzigen automatisierten Betriebssystem — ohne operatives Chaos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                <a href="#analyse" className="group inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#c9ff3d] pl-6 pr-2 text-sm font-bold text-black shadow-[0_16px_40px_rgba(135,200,0,.3)] transition-transform hover:-translate-y-1">
                  Shop analysieren
                  <span className="grid size-10 place-items-center rounded-lg bg-black text-white"><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </a>
                <a href="#system" className="group inline-flex min-h-14 items-center gap-3 rounded-xl border border-white/70 bg-white/90 pl-6 pr-2 text-sm font-bold text-black backdrop-blur transition-transform hover:-translate-y-1">
                  System ansehen
                  <span className="grid size-10 place-items-center rounded-lg border border-zinc-300 bg-white"><ArrowDown className="size-4" /></span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 border-x border-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
            {capabilities.map(([Icon, label]) => (
              <div key={label} className="flex min-h-24 items-center justify-center gap-3 border-b border-r border-zinc-200 px-4 text-sm font-semibold text-zinc-500 lg:border-b-0">
                <Icon className="size-5 text-zinc-400" /> {label}
              </div>
            ))}
          </div>
        </section>

        <section id="system" className="scroll-mt-8 bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Das Shopify-Betriebssystem</span><span>(01)</span>
            </Reveal>
            <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
                Autonome Operations für eine Welt ohne Copy-Paste.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 lg:justify-self-end">
                Kein Sammelsurium aus Tools. Ein klares System, in dem Daten, Entscheidungen und Übergaben zuverlässig ineinandergreifen.
              </p>
            </Reveal>

            <div className="mt-16 grid border-l border-t border-zinc-200 md:grid-cols-2 xl:grid-cols-4">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Reveal key={module.title} delay={index * 0.06}>
                    <article className={`group flex min-h-[430px] flex-col border-b border-r border-zinc-200 p-6 sm:p-8 ${module.featured ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}>
                      <div className="flex items-start justify-between">
                        <span className={`grid size-12 place-items-center rounded-full ${module.featured ? "bg-[#c9ff3d] text-black" : "bg-[#d8f4ff] text-sky-700"}`}><Icon className="size-5" /></span>
                        <span className={`text-xs ${module.featured ? "text-zinc-500" : "text-zinc-400"}`}>{module.number}</span>
                      </div>
                      <h3 className="mt-12 text-2xl font-semibold tracking-[-0.035em]">{module.title}</h3>
                      <p className={`mt-4 leading-7 ${module.featured ? "text-zinc-400" : "text-zinc-600"}`}>{module.copy}</p>
                      <div className="mt-auto pt-10">
                        <div className={`flex items-center justify-between border-t pt-4 text-xs font-semibold ${module.featured ? "border-white/15 text-[#c9ff3d]" : "border-zinc-200 text-zinc-500"}`}>
                          <span>{module.result}</span><ArrowRight className="size-4" />
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
              <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-sky-700">Dein System</span>
              <div>
                <p className="text-[clamp(4.5rem,10vw,9rem)] font-semibold leading-none tracking-[-0.08em]">100%</p>
                <p className="mt-2 max-w-xs text-xl font-semibold tracking-tight">Eigentum. Kein Lock-in. Keine Support-Falle.</p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="grid min-h-[440px] overflow-hidden rounded-[1.5rem] border border-zinc-200 sm:grid-cols-2">
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-full">
                <Image src="/westmonks-sky-hero.webp" alt="Alpine Landschaft" fill sizes="(min-width: 640px) 35vw, 100vw" className="object-cover object-left" />
              </div>
              <div className="flex flex-col justify-center bg-zinc-50 p-7 sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Build vs. Run</span>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Wir bauen nicht nur Automationen. Wir bauen dein Betriebssystem.</h3>
                <p className="mt-5 leading-7 text-zinc-600">Es entsteht in deinem Workspace und gehört dir. Den laufenden Betrieb sichern wir auf Wunsch modular und transparent ab.</p>
                <a href="#analyse" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-950">Eigenen Engpass prüfen <ArrowRight className="size-4" /></a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="prozess" className="scroll-mt-8 bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Vom Engpass zum System</span><span>(02)</span>
            </Reveal>
            <div className="mt-14 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <Reveal className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-zinc-950 p-6 text-white sm:p-8">
                <div className="absolute inset-0 opacity-75 [background:radial-gradient(circle_at_25%_15%,rgba(201,255,61,.35),transparent_26%),radial-gradient(circle_at_75%_75%,rgba(20,180,255,.45),transparent_32%)]" />
                <div className="relative flex h-full min-h-[500px] flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-zinc-400"><span>OPERATIONS CORE</span><span>LIVE MAP</span></div>
                  <div className="mx-auto grid w-full max-w-md gap-3">
                    {[
                      [ReceiptText, "Order Event", "erfasst"],
                      [DatabaseZap, "System Logic", "geprüft"],
                      [PackageCheck, "Fulfillment", "ausgeführt"],
                    ].map(([ItemIcon, label, status], index) => {
                      const Icon = ItemIcon as LucideIcon;
                      return (
                        <motion.div key={String(label)} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                          <span className="grid size-11 place-items-center rounded-xl bg-[#c9ff3d] text-black"><Icon className="size-5" /></span>
                          <span className="font-semibold">{String(label)}</span>
                          <span className="text-xs text-zinc-400">{String(status)}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#c9ff3d]"><span className="size-2 animate-pulse rounded-full bg-[#c9ff3d]" />System bereit</div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="max-w-2xl text-balance text-[clamp(3rem,5vw,5.7rem)] font-semibold leading-[0.93] tracking-[-0.06em]">Vom ersten Signal zur skalierbaren Realität.</h2>
                <div className="mt-10 border-l border-sky-300">
                  {processSteps.map(([number, title, copy]) => (
                    <div key={number} className="relative grid gap-2 border-b border-zinc-200 py-6 pl-9 sm:grid-cols-[140px_1fr] sm:gap-6">
                      <span className="absolute -left-4 top-6 grid size-8 place-items-center rounded-full bg-sky-400 text-xs font-bold text-white ring-8 ring-zinc-50">{number}</span>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="leading-7 text-zinc-600">{copy}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 py-24 text-white sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-white/20 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Engineering für Shopify Operations</span><span>(03)</span>
            </Reveal>
            <Reveal className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-4xl text-balance text-[clamp(3rem,5.8vw,6.5rem)] font-semibold leading-[0.91] tracking-[-0.065em]">Ein System. Vier operative Ebenen.</h2>
              <a href="#analyse" className="group inline-flex min-h-13 w-fit items-center gap-3 rounded-xl bg-[#c9ff3d] pl-5 pr-2 text-sm font-bold text-black">
                Shop prüfen <span className="grid size-9 place-items-center rounded-lg bg-black text-white"><MoveUpRight className="size-4" /></span>
              </a>
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {[
                [ReceiptText, "Financial & Order Sync", "Bestellungen, Belege und Bestände bewegen sich synchron statt über Exporte und Listen."],
                [Bot, "Autonomous Support", "Anfragen werden verstanden, priorisiert und entlang deiner Regeln zuverlässig bearbeitet."],
                [Boxes, "Fulfillment Orchestration", "Logistik-Ereignisse lösen die richtigen Folgeprozesse aus — inklusive Sonderfällen."],
                [ShieldCheck, "Exception Control", "Abweichungen werden sichtbar, bevor aus einem Einzelfall ein operatives Problem wird."],
              ].map(([ItemIcon, title, copy], index) => {
                const Icon = ItemIcon as LucideIcon;
                return (
                  <Reveal key={String(title)} delay={index * 0.05}>
                    <article className="group relative min-h-[360px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#141414] p-7 sm:p-9">
                      <div className={`absolute inset-x-0 bottom-0 h-2/3 opacity-80 transition-transform duration-700 group-hover:scale-110 ${index === 0 ? "[background:radial-gradient(ellipse_at_bottom,#a6e900,transparent_65%)]" : index === 1 ? "[background:radial-gradient(ellipse_at_bottom,#655cff,transparent_65%)]" : index === 2 ? "[background:radial-gradient(ellipse_at_bottom,#ff5722,transparent_65%)]" : "[background:radial-gradient(ellipse_at_bottom,#16bff4,transparent_65%)]"}`} />
                      <div className="relative flex h-full min-h-[290px] flex-col">
                        <div className="flex items-start justify-between"><Icon className="size-8" /><span className="grid size-9 place-items-center rounded-full bg-white text-black"><ChevronRight className="size-4" /></span></div>
                        <div className="mt-auto max-w-lg rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                          <h3 className="text-2xl font-semibold tracking-tight">{String(title)}</h3>
                          <p className="mt-3 leading-6 text-zinc-400">{String(copy)}</p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="analyse" className="scroll-mt-6 bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <span>/ Live-Potenzialanalyse</span><span>(04)</span>
            </Reveal>
            <Reveal className="mt-12 grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <h2 className="max-w-4xl text-balance text-[clamp(3.2rem,6.2vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">Dein Engpass. Klar sichtbar.</h2>
              <p className="max-w-xl text-lg leading-8 text-zinc-600 lg:justify-self-end">Gib deine öffentliche Shop-URL ein. Westmonks verdichtet sichtbare operative Signale zu einem klaren ersten Hebel — ohne Shop-Login.</p>
            </Reveal>

            <Reveal delay={0.08} className="mt-14 overflow-hidden rounded-[1.6rem] border border-zinc-200 shadow-[0_30px_90px_rgba(24,24,27,.08)]">
              <div className="grid lg:grid-cols-[.82fr_1.18fr]">
                <div className="bg-[#d8f4ff] p-6 sm:p-10 lg:p-12">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-sky-700"><LockKeyhole className="size-3.5" /> Sicherer Shop-Check</span>
                  <h3 className="mt-7 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Wo verliert dein Store heute Zeit?</h3>
                  <form className="mt-8" onSubmit={handleAnalyze}>
                    <label htmlFor="shop-url" className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-600">Shop-URL</label>
                    <div className="mt-3 rounded-2xl border border-sky-200 bg-white p-2 shadow-sm focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-200/60">
                      <div className="flex min-h-14 items-center gap-3 px-3">
                        <LockKeyhole className="size-4 shrink-0 text-sky-600" />
                        <input id="shop-url" name="shop-url" type="text" inputMode="url" autoComplete="url" required maxLength={300} value={shopUrl} onChange={(event) => setShopUrl(event.target.value)} placeholder="deinshop.de" className="min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400" aria-describedby="shop-url-help" />
                      </div>
                      <motion.button whileHover={{ scale: analysisState === "loading" ? 1 : 1.01 }} whileTap={{ scale: analysisState === "loading" ? 1 : 0.99 }} disabled={analysisState === "loading"} className="mt-2 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#c9ff3d] px-6 text-sm font-bold text-black transition-colors hover:bg-[#b7ef28] disabled:cursor-wait disabled:opacity-70" type="submit">
                        {analysisState === "loading" ? <><LoaderCircle className="size-4 animate-spin" />Shop wird sicher ausgewertet…</> : <>Engpass analysieren<Sparkles className="size-4" /></>}
                      </motion.button>
                    </div>
                  </form>
                  <p id="shop-url-help" className="mt-5 flex gap-3 text-sm leading-6 text-zinc-600"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-600" />Nur öffentlich sichtbare Signale. Kein Login und kein Zugriff auf interne Shopdaten.</p>
                </div>

                <div className="min-h-[500px] bg-zinc-950 p-6 text-white sm:p-10 lg:p-12">
                  <AnimatePresence mode="wait">
                    {analysisState === "idle" && (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[410px] flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-zinc-500"><span>ANALYSE OUTPUT</span><span>WESTMONKS / 01</span></div>
                        <div>
                          <span className="grid size-20 place-items-center rounded-[1.5rem] bg-[#c9ff3d] text-black"><LineChart className="size-8" /></span>
                          <h3 className="mt-7 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Ein klarer erster Hebel statt einer weiteren Tool-Liste.</h3>
                          <p className="mt-4 max-w-xl leading-7 text-zinc-400">Du erhältst eine indikative Einschätzung des manuellen Potenzials und des wahrscheinlichsten operativen Engpasses.</p>
                        </div>
                      </motion.div>
                    )}
                    {analysisState === "loading" && (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[410px] flex-col items-center justify-center text-center" aria-live="polite">
                        <div className="relative grid size-24 place-items-center rounded-full border border-white/15"><span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-[#c9ff3d]" /><Bot className="size-8 text-[#c9ff3d]" /></div>
                        <h3 className="mt-7 text-2xl font-semibold">Operations werden analysiert…</h3>
                        <p className="mt-3 max-w-sm text-zinc-400">Shop-Struktur, öffentliche Signale und mögliche manuelle Übergaben werden geprüft.</p>
                      </motion.div>
                    )}
                    {analysisState === "error" && (
                      <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[410px] flex-col items-center justify-center text-center" aria-live="assertive">
                        <span className="grid size-20 place-items-center rounded-[1.5rem] border border-rose-400/30 bg-rose-400/10 text-rose-300"><CircleAlert className="size-8" /></span>
                        <h3 className="mt-7 text-2xl font-semibold">Analyse nicht abgeschlossen.</h3>
                        <p className="mt-3 max-w-md leading-7 text-zinc-400">{analysisError}</p>
                        <button type="button" onClick={resetAnalysis} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold"><RotateCcw className="size-4" /> Erneut versuchen</button>
                      </motion.div>
                    )}
                    {analysisState === "success" && analysis && (
                      <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black"><Check className="size-3.5" /> Analyse abgeschlossen</span><span className="text-xs text-zinc-500">{confidenceLabel[analysis.confidence]}</span></div>
                        <p className="mt-7 text-sm font-medium text-zinc-500">{analysis.shopName}</p>
                        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{analysis.primaryBottleneck.title}</h3>
                        <p className="mt-4 leading-7 text-zinc-400">{analysis.primaryBottleneck.diagnosis}</p>
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/15 p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Potenzial / Monat</p><p className="mt-2 text-3xl font-semibold">{analysis.estimatedManualHoursPerMonth.minimum}–{analysis.estimatedManualHoursPerMonth.maximum} Std.</p></div>
                          <div className="rounded-2xl bg-[#c9ff3d] p-5 text-black"><p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">Erster Hebel</p><p className="mt-2 text-sm font-medium leading-6">{analysis.recommendedAutomation}</p></div>
                        </div>
                        <button type="button" onClick={resetAnalysis} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white"><RotateCcw className="size-4" /> Anderen Shop prüfen</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {analysisState === "success" && analysis && (
                  <motion.div id="anfrage" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="border-t border-zinc-200 bg-white">
                    <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:p-12">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-sky-600">Nächster Schritt</span>
                        <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Den Engpass sauber beseitigen.</h3>
                        <p className="mt-4 leading-7 text-zinc-600">Kein Standardpaket und kein langfristiger Tool-Vertrag. Du erhältst ein fixes, klar abgegrenztes Setup für deinen tatsächlichen Prozess.</p>
                        <ul className="mt-6 space-y-3 text-sm text-zinc-700">{["Individuelle Systemarchitektur", "Aufbau in deinem Workspace", "Saubere Übergabe ohne Lock-in"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-[#c9ff3d] text-black"><Check className="size-3.5" /></span>{item}</li>)}</ul>
                      </div>
                      <form onSubmit={handleInquiry} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block"><span className="text-sm font-semibold">Name</span><input name="name" required autoComplete="name" maxLength={120} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Dein Name" /></label>
                          <label className="block"><span className="text-sm font-semibold">E-Mail</span><input name="email" type="email" inputMode="email" required autoComplete="email" maxLength={254} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="name@unternehmen.de" /></label>
                        </div>
                        <label className="mt-4 block"><span className="text-sm font-semibold">Kontext <span className="font-normal text-zinc-400">(optional)</span></span><textarea name="message" rows={4} maxLength={1200} className="mt-2 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Was kostet dein Team aktuell am meisten Zeit?" /></label>
                        <button type="submit" className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-bold text-white hover:bg-zinc-800">{process.env.NEXT_PUBLIC_CONTACT_EMAIL ? <Send className="size-4" /> : <Copy className="size-4" />}{process.env.NEXT_PUBLIC_CONTACT_EMAIL ? "Projektanfrage senden" : "Projektanfrage kopieren"}</button>
                        <div aria-live="polite" className="mt-3 min-h-6 text-sm text-zinc-500">{inquiryState === "opened" && "Deine E-Mail-App wurde mit allen Angaben geöffnet."}{inquiryState === "copied" && "Anfrage kopiert. Du kannst sie jetzt in deinem bevorzugten Kontaktkanal einfügen."}{inquiryState === "error" && "Kopieren war nicht möglich. Bitte markiere deine Angaben manuell."}</div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </section>

        <section id="fragen" className="scroll-mt-6 bg-zinc-50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex items-center justify-between border-t border-zinc-300 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500"><span>/ Klare Antworten</span><span>(05)</span></Reveal>
            <div className="mt-12 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <Reveal><h2 className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Häufige Fragen.</h2><p className="mt-5 max-w-md leading-7 text-zinc-600">Kein Nebel, kein Lock-in. Hier sind die wichtigsten Antworten vor dem ersten Gespräch.</p></Reveal>
              <Reveal delay={0.08} className="border-t border-zinc-300">
                {[
                  ["Braucht die Analyse Zugriff auf meinen Shop?", "Nein. Der erste Check nutzt ausschließlich öffentlich sichtbare Signale und benötigt weder Login noch interne Shopdaten."],
                  ["Wem gehört das fertige System?", "Dir. Wir bauen in deinem Workspace auf, dokumentieren die Logik und übergeben ohne technische Abhängigkeit von Westmonks."],
                  ["Entstehen laufende Tool-Kosten?", "Nur wenn ein externer Dienst für deinen konkreten Prozess sinnvoll und von dir freigegeben ist. Solche Kosten werden vor dem Build transparent gemacht."],
                  ["Was passiert nach der Übergabe?", "Du kannst das System selbst betreiben. Wenn du Absicherung möchtest, ergänzen wir einen modularen Service für Überwachung und Weiterentwicklung."],
                ].map(([question, answer]) => (
                  <details key={question} className="group border-b border-zinc-300 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-300 text-xl transition-transform group-open:rotate-45">+</span></summary>
                    <p className="max-w-2xl pt-4 leading-7 text-zinc-600">{answer}</p>
                  </details>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-white pt-20">
          <Reveal className="mx-auto max-w-[1440px] overflow-hidden px-5 sm:px-8 lg:px-12">
            <p className="whitespace-nowrap text-center text-[clamp(4.4rem,12vw,12rem)] font-semibold leading-none tracking-[-0.085em]">Chaos raus.</p>
          </Reveal>
          <div className="relative mt-10 overflow-hidden border-y-4 border-white bg-sky-500 py-24 sm:py-32">
            <Image src="/westmonks-sky-hero.webp" alt="Berglandschaft unter blauem Himmel" fill sizes="100vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-sky-950/25" />
            <Reveal className="relative mx-auto max-w-4xl px-5 text-center text-white sm:px-8">
              <span className="inline-flex rounded-full border border-white/50 bg-white/90 px-4 py-2 text-xs font-bold text-zinc-950">Bereit für klare Operations?</span>
              <h2 className="mt-6 text-balance text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.065em] [text-shadow:0_4px_30px_rgba(0,35,60,.3)]">Dein Store wächst. Dein Aufwand nicht.</h2>
              <a href="#analyse" className="group mx-auto mt-8 inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#c9ff3d] pl-6 pr-2 text-sm font-bold text-black shadow-xl"><span>Shop jetzt analysieren</span><span className="grid size-10 place-items-center rounded-lg bg-black text-white"><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></a>
            </Reveal>
          </div>
        </section>

        <footer className="bg-zinc-950 px-5 py-12 text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px] rounded-[1.4rem] border border-white/10 bg-[#141414] p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_.6fr]">
              <div><div className="relative h-9 w-[145px] overflow-hidden"><Image src={logoUrl} alt="Westmonks" fill sizes="145px" className="scale-[1.7] object-contain brightness-0 invert" /></div><p className="mt-5 max-w-lg text-sm leading-6 text-zinc-400">Shopify Operations Engineering für wachsende Stores, die manuelle Arbeit durch belastbare Systeme ersetzen wollen.</p><a href="#analyse" className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-lg bg-[#c9ff3d] pl-4 pr-2 text-xs font-bold text-black">Analyse starten <span className="grid size-8 place-items-center rounded-md bg-black text-white"><MoveUpRight className="size-4" /></span></a></div>
              <div className="grid grid-cols-2 gap-6 text-sm"><div><p className="font-semibold text-white">Navigation</p><div className="mt-4 space-y-3 text-zinc-500"><a className="block hover:text-white" href="#system">System</a><a className="block hover:text-white" href="#prozess">Prozess</a><a className="block hover:text-white" href="#analyse">Analyse</a></div></div><div><p className="font-semibold text-white">Prinzip</p><div className="mt-4 space-y-3 text-zinc-500"><p>Dein Workspace</p><p>Dein System</p><p>Kein Lock-in</p></div></div></div>
            </div>
            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Westmonks</span><span>Shopify Operations · Automation · Ownership</span></div>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}
