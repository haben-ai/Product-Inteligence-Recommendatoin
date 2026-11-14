import { notFound } from "next/navigation";
import { isLocale, ui } from "@/content/ui";
import { StartActions } from "@/components/StartActions";

export default async function WelcomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <article className="flex flex-col gap-8 pt-8 sm:pt-16">
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
            <span aria-hidden className="dot" />
            {f}
          </li>
        ))}
      </ul>

      <StartActions lang={lang} />
    </article>
  );
}
