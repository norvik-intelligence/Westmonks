import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { industries, solutions, tools } from "@/lib/pseo-data";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lösungen nach Branche und Tool",
  description:
    "Shopify-Backend-Automatisierung nach Branche: Photovoltaik, Ladeinfrastruktur, Elektronik, Supplements, Möbel, Industriebedarf, Beauty und E-Mobility — jeweils mit dem Tool, an dem es hängt.",
  alternates: { canonical: "/loesungen" },
};

export default function SolutionsIndex() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Start",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lösungen",
        item: `${siteUrl}/loesungen`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-[#d8f4ff]">
        <SiteHeader />

        <section className="px-5 pb-20 pt-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-800">
              / Lösungen
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.6rem,6vw,6.4rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
              Jede Branche bricht an einer anderen Stelle.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-700">
              Der Normalfall ist überall gelöst. Interessant wird es bei der
              Ausnahme — und die sieht in jeder Branche anders aus. Hier findest
              du deinen Fall, kombiniert mit dem Tool, an dem er hängt.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            {industries.map((industry) => {
              const related = solutions.filter(
                (item) => item.industry.slug === industry.slug,
              );
              if (related.length === 0) return null;

              return (
                <div
                  key={industry.slug}
                  className="border-t border-zinc-200 py-12 first:border-t-0 first:pt-0"
                >
                  <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
                    <div>
                      <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                        {industry.name}
                      </h2>
                      <p className="mt-4 max-w-md leading-7 text-zinc-600">
                        {industry.orderProfile}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {related.map((solution) => (
                        <Link
                          key={solution.slug}
                          href={`/loesungen/${solution.slug}`}
                          className="group flex min-h-[160px] flex-col justify-between rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-zinc-950"
                        >
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                              {solution.tool.category}
                            </span>
                            <p className="mt-2 font-semibold leading-6">
                              {solution.tool.name}
                            </p>
                          </div>
                          <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-zinc-950">
                            Ansehen <ArrowRight className="size-3.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-zinc-50 py-16">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Nach Tool
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tools.map((tool) => {
                const first = solutions.find(
                  (item) => item.tool.slug === tool.slug,
                );
                if (!first) return null;
                return (
                  <Link
                    key={tool.slug}
                    href={`/loesungen/${first.slug}`}
                    className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                  >
                    {tool.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
