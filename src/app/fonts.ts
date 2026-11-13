import { Abyssinica_SIL, Menbere } from "next/font/google";
import localFont from "next/font/local";

// Brana (Amha Asfaw / Ra'ey Type, SIL OFL 1.1): the Ge'ez face for all Tigrinya text.
// unicode-range limits it to Ethiopic code points, so Latin text falls through to the next font.
export const brana = localFont({
  src: "./fonts/brana/Brana-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-brana",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+1200-139F, U+2D80-2DDF, U+AB00-AB2F, U+1E7E0-1E7FF",
    },
  ],
});

// Menbere: Latin body text (and Ge'ez fallback if Brana fails to load).
export const menbere = Menbere({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-menbere",
  display: "swap",
  // next/font has no metric overrides for Menbere; skip the auto fallback (avoids a build warning).
  adjustFontFallback: false,
});

// Abyssinica SIL: Latin headings (single 400 weight).
export const abyssinica = Abyssinica_SIL({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abyssinica",
  display: "swap",
});

export const fontVariables = `${brana.variable} ${menbere.variable} ${abyssinica.variable}`;
