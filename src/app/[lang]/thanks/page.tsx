import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, ui } from "@/content/ui";

export default async function ThanksPage({ params }: PageProps<"/[lang]/thanks">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <article className="flex flex-col gap-6 pt-8 sm:pt-16">
      <h1 className="font-display text-2xl sm:text-3xl">{t.thanksTitle}</h1>
      <p className="max-w-[34em] text-pretty text-muted">{t.thanksBody}</p>
      <p className="max-w-[34em] border-l-4 border-accent pl-4 text-pretty">{t.thanksShare}</p>
      <p>
        <Link href={`/${lang}`} className="link">
          {t.backHome}
        </Link>
      </p>
    </article>
  );
}
