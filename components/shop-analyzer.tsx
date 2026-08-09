"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  CircleAlert,
  Clock,
  LineChart,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";

type ConfidenceLevel = "hoch" | "mittel" | "niedrig";

type AuditFinding = {
  area: string;
  status: "kritisch" | "warnung" | "optimiert";
  finding: string;
  impact: string;
  recommendedSolution: string;
};

type AnalysisResult = {
  analyzedUrl: string;
  shopName: string;
  shopifyLikelihood: ConfidenceLevel;
  estimatedManualHoursPerMonth: { minimum: number; maximum: number };
  primaryBottleneck: { category: string; title: string; diagnosis: string };
  auditFindings: AuditFinding[];
  overallHealthScore: number;
  recommendedAutomation: string;
  publicSignals: string[];
  confidence: ConfidenceLevel;
  disclaimer: string;
};

type AnalyzeResponse =
  | { ok: true; requestId: string; data: AnalysisResult }
  | { ok: false; requestId: string; error: { code: string; message: string } };

const confidenceLabel: Record<ConfidenceLevel, string> = {
  hoch: "Hohe Sicherheit",
  mittel: "Mittlere Sicherheit",
  niedrig: "Niedrige Sicherheit",
};

export function ShopAnalyzer() {
  const [shopUrl, setShopUrl] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;

    setState("loading");
    setAnalysis(null);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shopUrl.trim() }),
        signal: AbortSignal.timeout(32_000),
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
      setState("success");
    } catch (caught) {
      const timedOut =
        caught instanceof Error &&
        (caught.name === "AbortError" || caught.name === "TimeoutError");

      setError(
        timedOut
          ? "Die Analyse hat zu lange gedauert. Bitte versuche es erneut."
          : caught instanceof Error
            ? caught.message
            : "Die Analyse konnte nicht gestartet werden.",
      );
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setAnalysis(null);
    setError("");
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-zinc-200 shadow-[0_30px_90px_rgba(24,24,27,.08)]">
      <div className="grid lg:grid-cols-[.82fr_1.18fr]">
        <div className="bg-[#d8f4ff] p-6 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-sky-700">
            <LockKeyhole className="size-3.5" /> Sicherer Shop-Check
          </span>
          <h3 className="mt-7 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Wo verliert dein Store heute Zeit?
          </h3>
          <form className="mt-8" onSubmit={handleAnalyze}>
            <label
              htmlFor="shop-url"
              className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-600"
            >
              Shop-URL
            </label>
            <div className="mt-3 rounded-2xl border border-sky-200 bg-white p-2 shadow-sm focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-200/60">
              <div className="flex min-h-14 items-center gap-3 px-3">
                <LockKeyhole className="size-4 shrink-0 text-sky-600" />
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
              <button
                disabled={state === "loading"}
                className="mt-2 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#c9ff3d] px-6 text-sm font-bold text-black transition-colors hover:bg-[#b7ef28] disabled:cursor-wait disabled:opacity-70"
                type="submit"
              >
                {state === "loading" ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Shop wird ausgewertet…
                  </>
                ) : (
                  <>
                    Engpass analysieren
                    <Sparkles className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          <p
            id="shop-url-help"
            className="mt-5 flex gap-3 text-sm leading-6 text-zinc-600"
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-600" />
            Nur öffentlich sichtbare Signale. Kein Login und kein Zugriff auf
            interne Shopdaten. Die Analyse ist eine Einschätzung, keine
            Tatsachenfeststellung.
          </p>
        </div>

        <div className="min-h-[500px] bg-zinc-950 p-6 text-white sm:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[410px] flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>ANALYSE OUTPUT</span>
                  <span>WESTMONKS / 01</span>
                </div>
                <div>
                  <span className="grid size-20 place-items-center rounded-[1.5rem] bg-[#c9ff3d] text-black">
                    <LineChart className="size-8" />
                  </span>
                  <h3 className="mt-7 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    Ein klarer erster Hebel statt einer weiteren Tool-Liste.
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-zinc-400">
                    Du erhältst eine indikative Einschätzung des manuellen
                    Potenzials und des wahrscheinlichsten operativen Engpasses.
                  </p>
                </div>
              </motion.div>
            )}

            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[410px] flex-col items-center justify-center text-center"
                aria-live="polite"
              >
                <div className="relative grid size-24 place-items-center rounded-full border border-white/15">
                  <span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-[#c9ff3d]" />
                  <Bot className="size-8 text-[#c9ff3d]" />
                </div>
                <h3 className="mt-7 text-2xl font-semibold">
                  Operations werden analysiert…
                </h3>
                <p className="mt-3 max-w-sm text-zinc-400">
                  Shop-Struktur, öffentliche Signale und mögliche manuelle
                  Übergaben werden geprüft.
                </p>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[410px] flex-col items-center justify-center text-center"
                aria-live="assertive"
              >
                <span className="grid size-20 place-items-center rounded-[1.5rem] border border-rose-400/30 bg-rose-400/10 text-rose-300">
                  <CircleAlert className="size-8" />
                </span>
                <h3 className="mt-7 text-2xl font-semibold">
                  Analyse nicht abgeschlossen.
                </h3>
                <p className="mt-3 max-w-md leading-7 text-zinc-400">{error}</p>
                <p className="mt-4 max-w-md text-sm text-zinc-500">
                  Du musst darauf nicht warten – schreib uns einfach direkt über
                  das Kontaktformular weiter unten.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold"
                >
                  <RotateCcw className="size-4" /> Erneut versuchen
                </button>
              </motion.div>
            )}

            {state === "success" && analysis && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AuditReport analysis={analysis} onReset={reset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {state === "success" && analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-zinc-200 bg-white"
          >
            {/* CTA Section */}
            <div className="bg-gradient-to-br from-zinc-50 to-white">
              <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:p-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-sky-600">
                    Nächster Schritt
                  </span>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                    Alle Befunde gleichzeitig lösen.
                  </h3>
                  <p className="mt-4 leading-7 text-zinc-600">
                    Kein Standardpaket und kein langfristiger Tool-Vertrag. Du
                    erhältst ein fixes, klar abgegrenztes Setup für deinen
                    tatsächlichen Prozess – von Audit über Build bis Übergabe.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                    {[
                      "Audit deiner realen Bestelldaten",
                      "Custom-Setup in deinem Workspace",
                      "Saubere Übergabe ohne Lock-in",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="grid size-6 place-items-center rounded-full bg-[#c9ff3d] text-black">
                          <Check className="size-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <ContactForm
                  context={`Audit ${analysis.analyzedUrl} · ${analysis.shopName} · Health ${analysis.overallHealthScore}% · ${analysis.primaryBottleneck.title}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Audit-Report: rendert direkt im dunklen Panel des Analyzers.        */
/* Bewusst dicht und technisch gehalten – der Report soll nach Befund  */
/* aussehen, nicht nach Marketing-Karte.                               */
/* ------------------------------------------------------------------ */

const severityStyle: Record<
  string,
  { label: string; text: string; border: string; bg: string; dot: string }
> = {
  kritisch: {
    label: "KRITISCH",
    text: "text-red-300",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    dot: "bg-red-400",
  },
  warnung: {
    label: "WARNUNG",
    text: "text-amber-300",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
  },
  optimiert: {
    label: "OPTIMIERT",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
};

const fallbackSeverity = {
  label: "BEFUND",
  text: "text-zinc-300",
  border: "border-white/10",
  bg: "bg-white/5",
  dot: "bg-zinc-400",
};

function AuditReport({
  analysis,
  onReset,
}: {
  analysis: AnalysisResult;
  onReset: () => void;
}) {
  const findings = analysis.auditFindings;
  const critical = findings.filter((f) => f.status === "kritisch").length;
  const warnings = findings.filter((f) => f.status === "warnung").length;
  const healthy = findings.filter((f) => f.status === "optimiert").length;

  const score = analysis.overallHealthScore;
  const scoreTone =
    score < 40
      ? { text: "text-red-400", bar: "bg-red-500", verdict: "Kritisch" }
      : score < 70
        ? { text: "text-amber-400", bar: "bg-amber-400", verdict: "Lückenhaft" }
        : { text: "text-[#c9ff3d]", bar: "bg-[#c9ff3d]", verdict: "Solide" };

  return (
    <div className="flex min-h-[410px] flex-col">
      {/* Kopfzeile: Terminal-Anmutung, macht klar dass hier gescannt wurde */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
        <span className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-[#c9ff3d]" />
          Audit Report
        </span>
        <span className="truncate text-zinc-400">{analysis.analyzedUrl}</span>
      </div>

      {/* Score-Block */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
            Operations Health
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-5xl font-semibold tabular-nums tracking-[-0.04em] ${scoreTone.text}`}
            >
              {score}
            </span>
            <span className="text-lg text-zinc-600">/100</span>
            <span className="ml-1 text-sm font-medium text-zinc-400">
              {scoreTone.verdict}
            </span>
          </p>
        </div>
        <div className="flex gap-2 font-mono text-[0.65rem] uppercase tracking-[0.1em]">
          <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-300">
            {critical} kritisch
          </span>
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-300">
            {warnings} warnung
          </span>
          <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
            {healthy} ok
          </span>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${scoreTone.bar}`}
        />
      </div>

      {/* Hauptengpass – der eine Satz, auf den es ankommt */}
      <div className="mt-7 rounded-2xl border border-[#c9ff3d]/25 bg-[#c9ff3d]/[0.07] p-5">
        <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#c9ff3d]">
          <Zap className="size-3.5" /> Primärer Engpass ·{" "}
          {analysis.primaryBottleneck.category}
        </p>
        <h4 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
          {analysis.primaryBottleneck.title}
        </h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {analysis.primaryBottleneck.diagnosis}
        </p>
      </div>

      {/* Befundliste */}
      <div className="mt-7">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
          Befunde ({findings.length})
        </p>
        <ul className="mt-3 space-y-2">
          {findings.map((finding, idx: number) => {
            const tone = severityStyle[finding.status] ?? fallbackSeverity;
            return (
              <motion.li
                key={`${finding.area}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * idx, duration: 0.35 }}
                className={`rounded-xl border ${tone.border} ${tone.bg} p-4`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`size-1.5 rounded-full ${tone.dot}`} />
                    {finding.area}
                  </span>
                  <span
                    className={`font-mono text-[0.6rem] uppercase tracking-[0.14em] ${tone.text}`}
                  >
                    {tone.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {finding.finding}
                </p>
                <p className="mt-1.5 flex gap-2 text-xs leading-5 text-zinc-500">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                  {finding.impact}
                </p>
                {finding.recommendedSolution !== "Keine" && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-zinc-300">
                    <Check className="size-3" />
                    {finding.recommendedSolution}
                  </p>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Fußzeile: Aufwand, Signale, Vorbehalt */}
      <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
            <Clock className="size-3.5" /> Manuelles Potenzial / Monat
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {analysis.estimatedManualHoursPerMonth.minimum}–
            {analysis.estimatedManualHoursPerMonth.maximum}
            <span className="ml-1 text-base font-normal text-zinc-500">
              Stunden
            </span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
            Empfohlene Automatisierung
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {analysis.recommendedAutomation}
          </p>
        </div>
      </div>

      {analysis.publicSignals.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
            Ausgewertete öffentliche Signale
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {analysis.publicSignals.map((signal) => (
              <li
                key={signal}
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-400"
              >
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-xs leading-5 text-zinc-600">
          {confidenceLabel[analysis.confidence]} · {analysis.disclaimer}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold transition-colors hover:bg-white/5"
        >
          <RotateCcw className="size-4" /> Neuer Scan
        </button>
      </div>
    </div>
  );
}
