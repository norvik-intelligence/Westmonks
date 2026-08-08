import Image from "next/image";
import Link from "next/link";

import { navigation } from "@/lib/site";

export const logoUrl =
  "https://res.cloudinary.com/kpcyenmx/image/upload/f_auto,q_auto/westmonks-logo-transparent_lzgn9i";

export function SiteHeader({ absolute = false }: { absolute?: boolean }) {
  return (
    <header
      className={
        absolute
          ? "absolute inset-x-4 top-4 z-20 sm:inset-x-7 sm:top-7 lg:inset-x-10 lg:top-9"
          : "relative z-20 px-4 pt-4 sm:px-7 sm:pt-7 lg:px-10 lg:pt-9"
      }
    >
      <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-4 shadow-[0_18px_50px_rgba(6,55,80,.16)] backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="relative h-8 w-[132px] overflow-hidden"
          aria-label="Westmonks Startseite"
        >
          <Image
            src={logoUrl}
            alt="Westmonks"
            fill
            priority
            sizes="132px"
            className="scale-[1.7] object-contain brightness-0"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-xs font-semibold text-zinc-700 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#analyse"
          className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#c9ff3d] pl-4 pr-2 text-xs font-bold text-black shadow-[0_8px_24px_rgba(157,225,0,.25)] transition-transform hover:-translate-y-0.5"
        >
          <span className="hidden sm:inline">Shop prüfen</span>
          <span className="sm:hidden">Analyse</span>
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-black text-white"
          >
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
