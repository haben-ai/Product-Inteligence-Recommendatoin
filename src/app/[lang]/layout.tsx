import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import { isLocale, locales, ui } from "@/content/ui";
import { SiteHeader } from "@/components/SiteHeader";
import "../globals.css";

const sans = Noto_Sans_Ethiopic({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-sans-ethiopic",
  display: "swap",
});

const serif = Noto_Serif_Ethiopic({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-serif-ethiopic",
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

export const viewport: Viewport = { themeColor: "#f5f6f2" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable}`}>
      <body>
        <SiteHeader lang={lang} />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
