"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/survey";
import { locales, ui } from "@/content/ui";
import { TibebBand } from "./TibebBand";

export function SiteHeader({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(ti|en)(?=\/|$)/, "");
  // The survey draws its own band as a progress bar.
  const showBand = !rest.startsWith("/survey");

  return (
    <header>
      {showBand && <TibebBand />}
      <div className="site-header-inner mx-auto flex max-w-[38rem] items-center justify-between gap-2 px-4 pt-4">
        <Link
          href={`/${lang}`}
          className="font-display text-base text-fg no-underline"
        >
          {ui[lang].brand}
        </Link>
        <nav aria-label="Language / ቋንቋ">
          <ul className="flex items-center gap-1 text-sm">
            {locales.map((l) => {
              const current = l === lang;
              return (
                <li key={l}>
                  <Link
                    href={`/${l}${rest}`}
                    hrefLang={l}
                    lang={l}
                    aria-current={current ? "true" : undefined}
                    className={
                      "inline-flex min-h-11 items-center rounded-full px-3 transition-colors " +
                      (current
                        ? "bg-fg text-bg"
                        : "text-muted hover:bg-line/60 hover:text-fg")
                    }
                  >
                    {ui[l].langName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
