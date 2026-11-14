import type { Locale } from "./survey";

export const locales: Locale[] = ["ti", "en"];
export const defaultLocale: Locale = "ti";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

// Intro and thank-you copy come from the survey documents.
// Tigrigna interface strings (buttons, errors) are drafts — have a native speaker review them.
export const ui = {
  en: {
    langName: "English",
    brand: "Tigrigna Beauty & Care",
    metaTitle: "Skincare & haircare survey — Tigrigna Beauty & Care",
    metaDescription:
      "A short survey about skincare and haircare needs in the Tigrigna-speaking community.",
    introTitle: "Skincare & Haircare Needs",
    introBody: [
      "We are conducting a short survey to better understand people's experiences, challenges, and preferences regarding skincare and haircare.",
      "Your feedback will help us develop accessible and useful beauty education and product recommendation services.",
    ],
    facts: ["9 questions", "About 2 minutes", "Anonymous — we don't ask for your name or email"],
    start: "Let's get started",
    resume: "Continue where you left off",
    restart: "Start over",
    questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
    next: "Next",
    back: "Back",
    submit: "Send my answers",
    sending: "Sending…",
    pleaseChoose: "Choose an answer to continue.",
    pleaseSpecify: "Please specify",
    specifyMissing: "Write a few words for “Other”, or unselect it.",
    maxReached: (max: number) => `You've chosen ${max}. Unselect one to pick another.`,
    submitError: "Your answers weren't sent. Check your connection and try again.",
    thanksTitle: "Thank you!",
    thanksBody:
      "Thank you for participating! Your feedback will help us better understand the skincare and haircare needs of our community and develop a more accessible, informative platform.",
    thanksShare: "Know someone who might like to take part? Share this page with them.",
    backHome: "Back to the start",
  },
  ti: {
    langName: "ትግርኛ",
    brand: "Tigrigna Beauty & Care",
    metaTitle: "መጽናዕቲ ክንክን ቆርበትን ጸጉርን — Tigrigna Beauty & Care",
    metaDescription: "ብዛዕባ ክንክን ቆርበትን ጸጉርን ሓጺር መጽናዕቲ።",
    introTitle: "መጽናዕቲ ብዛዕባ ክንክን ቆርበትን ጸጉርን",
    introBody: [
      "እዚ ሓጺር መጽናዕቲ፡ ሰባት ብዛዕባ ክንክን ቆርበትን ጸጉርን ዘለዎም ተመኩሮ፡ ዝገጥሞም ጸገማትን ድሌታትን ንምርዳእ ዝተዳለወ እዩ።",
      "ርእይቶኹም ብቐሊሉ ክርዳኣካ ዝኽአል፡ ጠቓሚ ሓበሬታን ምኽርታትን ብዛዕባ ክንክን ቆርበትን ጸጉርን ዝህብ ኣገልግሎት ንምድላው ክሕግዘና እዩ።",
    ],
    facts: ["9 ሕቶታት", "ኣስታት 2 ደቒቕ", "ስምኩም ወይ ኢመይልኩም ኣይንሓትትን"],
    start: "ንጀምር!",
    resume: "ካብ ዝኣረፍኩምሉ ቀጽሉ",
    restart: "ካብ መጀመርታ ጀምሩ",
    questionOf: (n: number, total: number) => `ሕቶ ${n} ካብ ${total}`,
    next: "ቀጽሉ",
    back: "ተመለሱ",
    submit: "መልስታትኩም ስደዱ",
    sending: "ይስደድ ኣሎ…",
    pleaseChoose: "ንምቕጻል ሓደ መልሲ ምረጹ።",
    pleaseSpecify: "ግለጹ",
    specifyMissing: "ን„ካልእ“ ሓጺር መብርሂ ጽሓፉ፡ ወይ ምርጫኹም ኣልዕሉ።",
    maxReached: (max: number) => `${max} መሪጽኩም ኣለኹም። ካልእ ንምምራጽ ሓደ ኣልዕሉ።`,
    submitError: "መልስታትኩም ኣይተሰደደን። ኢንተርነትኩም ኣረጋግጹ እሞ እንደገና ፈትኑ።",
    thanksTitle: "የቐንየልና!",
    thanksBody:
      "ኣብዚ መጽናዕቲ ስለ ዝተሳተፍኩም ብጣዕሚ የቐንየልና! ርእይቶኹም ድሌታት ክንክን ቆርበትን ጸጉርን ንምርዳእን፡ ቀሊል፡ ጠቓምን ሓበሬታ ዝህብ ኣገልግሎት ንምምዕባልን ክሕግዘና እዩ።",
    thanksShare: "ክሳተፍ ዝደሊ ሰብ ትፈልጡ ዶ? ነዚ ገጽ ኣካፍልዎ።",
    backHome: "ናብ መጀመርታ ተመለሱ",
  },
} satisfies Record<Locale, unknown>;

export type UI = (typeof ui)["en"];
