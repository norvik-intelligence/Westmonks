"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Check, CircleAlert, LoaderCircle, Send } from "lucide-react";

import { site } from "@/lib/site";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm({
  context,
  compact = false,
}: {
  /** Woher die Anfrage kommt – landet als Kontext in der Mail. */
  context?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          message: String(data.get("message") ?? ""),
          context: context ?? "",
          website: String(data.get("website") ?? ""),
        }),
        signal: AbortSignal.timeout(20_000),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: { message: string };
      };

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error?.message ??
            "Die Anfrage konnte nicht gesendet werden.",
        );
      }

      form.reset();
      setState("sent");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Die Anfrage konnte nicht gesendet werden.",
      );
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50 p-8 text-center"
        aria-live="polite"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#c9ff3d] text-black">
          <Check className="size-6" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
          Anfrage ist angekommen.
        </h3>
        <p className="mt-3 leading-7 text-zinc-600">{site.responseTime}</p>
        <p className="mt-4 text-sm text-zinc-500">
          Dringend? Schreib direkt an{" "}
          <a
            className="font-semibold text-zinc-900 underline underline-offset-4"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[1.4rem] border border-zinc-200 bg-zinc-50 ${compact ? "p-5" : "p-5 sm:p-7"}`}
    >
      {/* Honeypot – für Menschen unsichtbar, für einfache Bots verlockend. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website (bitte leer lassen)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            maxLength={120}
            className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            placeholder="Dein Name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">E-Mail</span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            maxLength={254}
            className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            placeholder="name@unternehmen.de"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold">
          Shop oder Unternehmen{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </span>
        <input
          name="company"
          autoComplete="organization"
          maxLength={160}
          className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          placeholder="deinshop.de"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold">
          Was kostet euch aktuell am meisten Zeit?
        </span>
        <textarea
          name="message"
          required
          rows={compact ? 3 : 4}
          maxLength={2000}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          placeholder="Zum Beispiel: Rechnungen für Teillieferungen legen wir jeden Morgen von Hand an."
        />
      </label>

      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-zinc-600">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 shrink-0 rounded border-zinc-400"
        />
        <span>
          Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der
          Anfrage verarbeitet werden. Details in der{" "}
          <Link
            href="/datenschutz"
            className="font-semibold text-zinc-900 underline underline-offset-4"
          >
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70"
      >
        {state === "sending" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Wird gesendet…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Anfrage senden
          </>
        )}
      </button>

      <div aria-live="polite" className="mt-3 min-h-6 text-sm">
        {state === "error" ? (
          <p className="flex items-start gap-2 text-rose-600">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>
              {error} Alternativ direkt an{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
              .
            </span>
          </p>
        ) : (
          <p className="text-zinc-500">
            Oder direkt an{" "}
            <a
              className="font-semibold text-zinc-700 underline underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
