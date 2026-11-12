import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Abyssinica_SIL, Menbere } from "next/font/google";
import { isLocale, locales, ui } from "@/content/ui";
import { SiteHeader } from "@/components/SiteHeader";
import "../globals.css";

// Menbere: modern variable Ge'ez + Latin for body text, questions and answers.
const menbere = Menbere({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-menbere",
  display: "swap",
});

// Abyssinica SIL: traditional calligraphic Ge'ez for headings (single 400 weight).
const abyssinica = Abyssinica_SIL({
  subsets: ["ethiopic", "latin"],
  weight: "400",
  variable: "--font-abyssinica",
  display: "swap",
});

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

export const viewport: Viewport = { themeColor: "#fdf2f8" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${menbere.variable} ${abyssinica.variable}`}>
      <body>
        <SiteHeader lang={lang} />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
