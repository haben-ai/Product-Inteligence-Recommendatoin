import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTACT_EMAIL, isLocale, ui } from "@/content/ui";

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <article className="flex flex-col gap-8 pt-8 sm:pt-12">
      <h1 className="font-display text-2xl sm:text-3xl">{t.privacyTitle}</h1>
      <dl className="flex flex-col gap-6">
        {t.privacy.map((s) => (
          <div key={s.h} className="flex flex-col gap-1">
            <dt className="font-display text-lg">{s.h}</dt>
            <dd className="m-0 max-w-[34em] text-pretty text-muted">{s.p}</dd>
          </div>
        ))}
        {CONTACT_EMAIL && (
          <div className="flex flex-col gap-1">
            <dt className="font-display text-lg">{t.contact}</dt>
            <dd className="m-0">
              <a href={`mailto:${CONTACT_EMAIL}`} className="link">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
        )}
      </dl>
      <p>
        <Link href={`/${lang}`} className="link">
          {t.backHome}
        </Link>
      </p>
    </article>
  );
}
