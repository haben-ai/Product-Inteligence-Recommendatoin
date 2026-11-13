import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import { TibebBand } from "@/components/TibebBand";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Tigrigna Beauty & Care",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// Second root layout: /admin is English-only and sits outside the /[lang] site.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <TibebBand />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-16 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
