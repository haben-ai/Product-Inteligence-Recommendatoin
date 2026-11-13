import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, ui } from "@/content/ui";
import { StartActions } from "@/components/StartActions";
import { Scene } from "@/components/illustrations/Scene";

export default async function WelcomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <article className="page-wide grid gap-8 pt-4 sm:pt-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-x-8 lg:gap-x-14 lg:pt-12">
      <Scene name="welcome" variant="panel" className="md:order-last" />
      <div className="flex flex-col gap-8">
        <h1 className="font-display text-2xl text-balance sm:text-3xl">
          {t.introTitle}
        </h1>

        <div className="flex flex-col gap-4 text-muted">
          {t.introBody.map((p) => (
            <p key={p} className="max-w-[34em] text-pretty">
              {p}
            </p>
          ))}
        </div>

        <ul className="flex flex-col gap-2 border-y border-line py-4 text-sm">
          {t.facts.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span aria-hidden className="diamond" />
              {f}
            </li>
          ))}
        </ul>

        <StartActions lang={lang} />

        <p className="text-sm text-muted">
          <Link href={`/${lang}/privacy`} className="link">
            {t.privacyLink}
          </Link>
        </p>
      </div>
    </article>
  );
}
