"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  CircleAlert,
  LineChart,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black">
                    <Check className="size-3.5" /> Audit abgeschlossen
                  </span>
                  <span className="text-xs text-zinc-500">
                    {confidenceLabel[analysis.confidence]}
                  </span>
                </div>
                <p className="mt-7 text-sm font-medium text-zinc-500">
                  {analysis.shopName}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  {analysis.primaryBottleneck.title}
                </h3>
                <p className="mt-4 leading-7 text-zinc-400">
                  {analysis.primaryBottleneck.diagnosis}
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Potenzial / Monat
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {analysis.estimatedManualHoursPerMonth.minimum}–
                      {analysis.estimatedManualHoursPerMonth.maximum} Std.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#c9ff3d] p-5 text-black">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">
                      Health-Score
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {analysis.overallHealthScore}%
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-xs leading-5 text-zinc-600">
                  {analysis.disclaimer}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white"
                >
                  <RotateCcw className="size-4" /> Anderen Shop prüfen
                </button>
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
            {/* Audit-Dashboard */}
            <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-sky-600">
                  Audit-Dashboard
                </span>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  Wo es wirklich zwickt.
                </h3>
                <p className="mt-4 leading-7 text-zinc-600">
                  Diese Befunde basieren auf den öffentlich sichtbaren Signalen
                  deines Shops. Jeder Punkt zeigt auf eine konkrete, lösbare
                  Schmerzstelle.
                </p>
              </div>

              {/* Findings Grid */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.auditFindings.map((finding, idx: number) => {
                  const statusColor: Record<string, string> = {
                    kritisch: "bg-red-50 border-red-200",
                    warnung: "bg-amber-50 border-amber-200",
                    optimiert: "bg-emerald-50 border-emerald-200",
                  };
                  const statusDot: Record<string, string> = {
                    kritisch: "bg-red-500",
                    warnung: "bg-amber-500",
                    optimiert: "bg-emerald-500",
                  };

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`rounded-2xl border p-5 ${statusColor[finding.status] || "bg-zinc-50 border-zinc-200"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-600">
                            {finding.area}
                          </p>
                          <h4 className="mt-2 text-base font-semibold text-zinc-950">
                            {finding.finding}
                          </h4>
                        </div>
                        <span
                          className={`mt-0.5 size-3 shrink-0 rounded-full ${statusDot[finding.status] || "bg-zinc-400"}`}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-700">
                        {finding.impact}
                      </p>
                      {finding.recommendedSolution !== "Keine" && (
                        <p className="mt-3 rounded-lg bg-white/60 px-3 py-2 text-xs font-medium text-zinc-700">
                          💡 {finding.recommendedSolution}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CTA Section */}
            <div className="border-t border-zinc-200 bg-gradient-to-br from-zinc-50 to-white">
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
