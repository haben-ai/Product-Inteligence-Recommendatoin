import { Abyssinica_SIL, Menbere } from "next/font/google";

// Menbere: modern variable Ge'ez + Latin for body text, questions and answers.
export const menbere = Menbere({
  subsets: ["ethiopic", "latin"],
  weight: "variable",
  variable: "--font-menbere",
  display: "swap",
  // next/font has no metric overrides for Menbere; skip the auto fallback (avoids a build warning).
  adjustFontFallback: false,
});

// Abyssinica SIL: traditional calligraphic Ge'ez for headings (single 400 weight).
export const abyssinica = Abyssinica_SIL({
  subsets: ["ethiopic", "latin"],
  weight: "400",
  variable: "--font-abyssinica",
  display: "swap",
});

export const fontVariables = `${menbere.variable} ${abyssinica.variable}`;
