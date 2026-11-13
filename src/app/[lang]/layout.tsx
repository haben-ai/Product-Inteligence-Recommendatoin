import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "../fonts";
import { isLocale, locales, ui } from "@/content/ui";
import { SiteHeader } from "@/components/SiteHeader";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = ui[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { languages: { ti: "/ti", en: "/en" } },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SiteHeader lang={lang} />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
