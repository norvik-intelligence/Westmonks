import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { ShopAnalyzer } from "@/components/shop-analyzer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getRelatedSolutions,
  getSolution,
  solutions,
} from "@/lib/pseo-data";
import { site, siteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    return { title: "Nicht gefunden" };
  }

  const url = `${siteUrl}/loesungen/${solution.slug}`;

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    alternates: { canonical: `/loesungen/${solution.slug}` },
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      url,
      type: "article",
      locale: "de_DE",
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: solution.metaTitle,
      description: solution.metaDescription,
    },
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) notFound();

  const { industry, tool } = solution;
  const { sameIndustry, sameTool } = getRelatedSolutions(solution);
  const url = `${siteUrl}/loesungen/${solution.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: solution.h1,
    description: solution.metaDescription,
    inLanguage: "de-DE",
    mainEntityOfPage: url,
    about: [
      { "@type": "Thing", name: industry.name },
      { "@type": "Thing", name: tool.name },
    ],
    author: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: solution.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lösungen",
        item: `${siteUrl}/loesungen`,
      },
      { "@type": "ListItem", position: 3, name: solution.h1, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen bg-[#d8f4ff]">
        <SiteHeader />

        <section className="px-5 pb-20 pt-14 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <nav
              aria-label="Brotkrumen"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-900"
            >
              <Link href="/" className="hover:underline">
                Start
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/loesungen" className="hover:underline">
                Lösungen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-sky-700">{industry.name}</span>
            </nav>

            <h1 className="mt-8 max-w-4xl text-balance text-[clamp(2.4rem,5.6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              {solution.h1}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-700">
              {solution.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#anfrage"
                className="group inline-flex min-h-14 items-center gap-3 rounded-xl bg-[#c9ff3d] pl-6 pr-2 text-sm font-bold text-black shadow-[0_16px_40px_rgba(135,200,0,.3)] transition-transform hover:-translate-y-1"
              >
                Fall besprechen
                <span className="grid size-10 place-items-center rounded-lg bg-black text-white">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <Link
                href="/#analyse"
                className="inline-flex min-h-14 items-center gap-3 rounded-xl border border-white/70 bg-white/90 px-6 text-sm font-bold text-black backdrop-blur transition-transform hover:-translate-y-1"
              >
                Shop analysieren
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
              <div>
                <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                  Was bei {industry.audience}n konkret liegen bleibt
                </h2>
                <ul className="mt-8 space-y-6">
                  {industry.painPoints.map((point) => (
                    <li
                      key={point}
                      className="border-l-2 border-sky-300 pl-5 leading-7 text-zinc-600"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] bg-zinc-50 p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Einordnung
                </p>
                <p className="mt-5 leading-8 text-zinc-700">
                  {solution.situation}
                </p>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Öffentlich sichtbare Signale
                </p>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                  {industry.publicSignals.map((signal) => (
                    <li key={signal} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-400" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pb-20 sm:pb-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-7 sm:p-9">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-zinc-500 ring-1 ring-zinc-200">
                  <Check className="size-3.5" /> Was {tool.name} abdeckt
                </span>
                <p className="mt-6 leading-7 text-zinc-600">{tool.covers}</p>
                <p className="mt-5 text-sm leading-6 text-zinc-500">
                  {tool.integrationNote}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-zinc-950 p-7 text-white sm:p-9">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#c9ff3d] px-3 py-1.5 text-xs font-bold text-black">
                  <X className="size-3.5" /> Wo es aufhört
                </span>
                <ul className="mt-6 space-y-4">
                  {tool.limits.map((limit) => (
                    <li key={limit} className="flex gap-3 leading-7 text-zinc-300">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c9ff3d]" />
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-zinc-200 p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                Die Fälle, die den Unterschied machen
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {industry.edgeCases.map((edgeCase) => (
                  <div
                    key={edgeCase}
                    className="rounded-2xl bg-[#d8f4ff] p-5 leading-6 text-zinc-800"
                  >
                    {edgeCase}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <h2 className="max-w-3xl text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              So gehen wir vor
            </h2>
            <div className="mt-10 border-l border-sky-300">
              {solution.architecture.map((step) => (
                <div
                  key={step.step}
                  className="relative grid gap-2 border-b border-zinc-200 py-6 pl-9 sm:grid-cols-[160px_1fr] sm:gap-6"
                >
                  <span className="absolute -left-4 top-6 grid size-8 place-items-center rounded-full bg-sky-400 text-xs font-bold text-white ring-8 ring-zinc-50">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="leading-7 text-zinc-600">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
          Eigenstaendiger Nutzen statt Doorway: die Analyse laeuft auf jeder
          pSEO-Seite, nicht nur auf der Startseite. Besucher bekommen hier ein
          Ergebnis zu ihrem eigenen Shop, ohne weiterklicken zu muessen.
        */}
        <section id="analyse" className="scroll-mt-6 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Wie viel davon trifft auf euren Shop zu?
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-zinc-600">
              Trag deine Shop-Adresse ein. Die Analyse liest oeffentlich
              sichtbare Signale aus und ordnet ein, welche der oben
              beschriebenen Faelle bei {industry.audience}n typischerweise
              zuerst auftreten.
            </p>
            <div className="mt-14">
              <ShopAnalyzer />
            </div>
          </div>
        </section>

        <section id="anfrage" className="scroll-mt-6 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                  Passt das auf euren Fall?
                </h2>
                <p className="mt-6 leading-8 text-zinc-600">
                  Beschreib kurz, wie es bei euch läuft. Wir antworten mit einer
                  ehrlichen Einschätzung — auch dann, wenn eine fertige App für
                  euch die bessere Antwort ist.
                </p>
                <p className="mt-6">
                  <a
                    className="text-lg font-semibold text-zinc-950 underline underline-offset-4"
                    href={`mailto:${site.email}`}
                  >
                    {site.email}
                  </a>
                </p>
              </div>
              <ContactForm
                context={`${industry.name} · ${tool.name} (/loesungen/${solution.slug})`}
              />
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <h2 className="text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Häufige Fragen
            </h2>
            <div className="mt-10 border-t border-zinc-300">
              {solution.faq.map((entry) => (
                <details
                  key={entry.question}
                  className="group border-b border-zinc-300 py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold">
                    <span>{entry.question}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-300 text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pt-4 leading-7 text-zinc-600">
                    {entry.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internes Silo: haelt Crawler und Leser im Themencluster. */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            {sameIndustry.length > 0 && (
              <div className="border-t border-zinc-200 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Weitere Tools für {industry.name}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sameIndustry.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/loesungen/${item.slug}`}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                    >
                      {item.tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {sameTool.length > 0 && (
              <div className="mt-10 border-t border-zinc-200 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  {tool.name} in anderen Branchen
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sameTool.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/loesungen/${item.slug}`}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                    >
                      {item.industry.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 border-t border-zinc-200 pt-8">
              <Link
                href="/loesungen"
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-950"
              >
                Alle Lösungen im Überblick <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
