import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const MAX_BODY_BYTES = 8_192;
const REQUEST_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}

function consume(key: string, now = Date.now()) {
  if (buckets.size > 5_000) {
    buckets.forEach((bucket, bucketKey) => {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    });
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= REQUEST_LIMIT) return false;
  current.count += 1;
  return true;
}

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Verhindert Header-Injection in Betreff und Reply-To. */
function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!consume(clientKey(request))) {
    return fail(
      429,
      "RATE_LIMITED",
      "Zu viele Anfragen in kurzer Zeit. Bitte versuche es später erneut.",
    );
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return fail(415, "UNSUPPORTED_MEDIA_TYPE", "Bitte sende JSON.");
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return fail(413, "PAYLOAD_TOO_LARGE", "Die Anfrage ist zu groß.");
    }
    body = JSON.parse(raw);
  } catch {
    return fail(400, "INVALID_JSON", "Die Anfrage enthält kein gültiges JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail(400, "INVALID_REQUEST", "Unerwartetes Anfrageformat.");
  }

  const input = body as Record<string, unknown>;

  // Honeypot: ausgefüllt heißt Bot. Wir antworten bewusst mit ok,
  // damit der Bot keinen Hinweis auf die Erkennung bekommt.
  if (clean(input.website, 200)) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const name = singleLine(clean(input.name, 120));
  const email = singleLine(clean(input.email, 254));
  const company = singleLine(clean(input.company, 160));
  const context = singleLine(clean(input.context, 200));
  const message = clean(input.message, 2000);

  if (!name || !message) {
    return fail(400, "MISSING_FIELDS", "Bitte fülle Name und Nachricht aus.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    return fail(400, "INVALID_EMAIL", "Bitte gib eine gültige E-Mail-Adresse an.");
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_TO?.trim() || user;

  if (!host || !user || !password || !to) {
    console.error("Kontaktformular ist nicht konfiguriert.");
    return fail(
      503,
      "NOT_CONFIGURED",
      "Der Versand ist gerade nicht verfügbar.",
    );
  }

  const port = Number(process.env.SMTP_PORT ?? 465);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const lines = [
    `Name:    ${name}`,
    `E-Mail:  ${email}`,
    company ? `Firma:   ${company}` : null,
    context ? `Kontext: ${context}` : null,
    "",
    message,
  ].filter((line): line is string => line !== null);

  try {
    await transporter.sendMail({
      // Absender muss die eigene Domain sein, sonst greift SPF/DMARC nicht.
      from: `"Westmonks Website" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `Anfrage von ${name}${company ? ` · ${company}` : ""}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("Versand der Kontaktanfrage fehlgeschlagen", {
      reason: error instanceof Error ? error.message : "unbekannt",
    });
    return fail(
      502,
      "SEND_FAILED",
      "Die Anfrage konnte nicht zugestellt werden.",
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
