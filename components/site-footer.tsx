import Image from "next/image";
import Link from "next/link";

import { logoUrl } from "@/components/site-header";
import { industries, solutions } from "@/lib/pseo-data";
import { site } from "@/lib/site";

export function SiteFooter() {
  const industryLinks = industries
    .map((industry) => ({
      industry,
      solution: solutions.find((item) => item.industry.slug === industry.slug),
    }))
    .filter((entry) => entry.solution);

  return (
    <footer className="bg-zinc-950 px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px] rounded-[1.4rem] border border-white/10 bg-[#141414] p-7 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <div className="relative h-9 w-[145px] overflow-hidden">
              <Image
                src={logoUrl}
                alt="Westmonks"
                fill
                sizes="145px"
                className="scale-[1.7] object-contain brightness-0 invert"
              />
            </div>
            <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-400">
              Shopify Operations Engineering für wachsende Stores, die manuelle
              Arbeit durch belastbare Systeme ersetzen wollen.
            </p>

            <div className="mt-7 space-y-2 text-sm">
              <p className="font-semibold text-white">Direkter Kontakt</p>
              <p>
                <a
                  className="text-[#c9ff3d] underline-offset-4 hover:underline"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </p>
              {site.phone ? (
                <p>
                  <a
                    className="text-zinc-300 hover:text-white"
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  >
                    {site.phone}
                  </a>
                </p>
              ) : null}
              <p className="text-xs text-zinc-500">{site.responseTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-white">Navigation</p>
              <div className="mt-4 space-y-3 text-zinc-500">
                <Link className="block hover:text-white" href="/#system">
                  System
                </Link>
                <Link className="block hover:text-white" href="/#prozess">
                  Prozess
                </Link>
                <Link className="block hover:text-white" href="/loesungen">
                  Lösungen
                </Link>
                <Link className="block hover:text-white" href="/#analyse">
                  Analyse
                </Link>
                <Link className="block hover:text-white" href="/#kontakt">
                  Kontakt
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">Rechtliches</p>
              <div className="mt-4 space-y-3 text-zinc-500">
                <Link className="block hover:text-white" href="/impressum">
                  Impressum
                </Link>
                <Link className="block hover:text-white" href="/datenschutz">
                  Datenschutz
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Lösungen nach Branche
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {industryLinks.map(({ industry, solution }) => (
              <Link
                key={industry.slug}
                href={`/loesungen/${solution!.slug}`}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-[#c9ff3d]/40 hover:text-white"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Westmonks</span>
          <span>Shopify Operations · Automation · Ownership</span>
        </div>
      </div>
    </footer>
  );
}
