// Market-research survey: single source of truth for every question.
// Text is copied from "Final_Website Survey English.docx" and "Final_Website Survey Tigrinya .docx".
// Option ids are stored in the database, so never rename an id once responses exist —
// add a new id and bump SURVEY_VERSION instead.

// v1: original 10 questions. v2: final documents — 9 questions (interest question removed,
// "TikTok or Instagram" + "YouTube" merged into "Social media", new usefulness wording, reordered).
export const SURVEY_VERSION = 2;

export type Locale = "ti" | "en";
export type Text = Record<Locale, string>;

export type Option = {
  id: string;
  label: Text;
  /** Shows a free-text field when selected ("Other (please specify)"). */
  other?: boolean;
  /** Selecting this clears every other choice (e.g. "I don't experience any difficulties"). */
  exclusive?: boolean;
};

export type Question = {
  id: string;
  kind: "single" | "multi";
  /** Maximum number of choices for multi questions. */
  max?: number;
  title: Text;
  hint?: Text;
  options: Option[];
};

const OTHER: Text = { en: "Other (please specify)", ti: "ካልእ (ግለጾም)" };
const SELECT_ALL: Text = {
  en: "Select all that apply",
  ti: "ካብ ሓደ ንላዕሊ ክትመርጹ ትኽእሉ ኢኹም",
};
const UP_TO_THREE: Text = { en: "Select up to 3", ti: "ክሳብ ሰለስተ ምረጹ" };

// Order and wording follow the FINAL documents (9 questions). Question ids keep their
// original names so answers to unchanged questions line up with version-1 responses.
export const questions: Question[] = [
  {
    id: "q1_age",
    kind: "single",
    title: { en: "What is your age group?", ti: "ዕድመኹም ኣብ ኣየናይ ጉጅለ ይርከብ?" },
    options: [
      { id: "18_24", label: { en: "18–24", ti: "18–24" } },
      { id: "25_34", label: { en: "25–34", ti: "25–34" } },
      { id: "35_44", label: { en: "35–44", ti: "35–44" } },
      { id: "45_54", label: { en: "45–54", ti: "45–54" } },
      { id: "55_plus", label: { en: "55+", ti: "55ን ልዕሊኡን" } },
    ],
  },
  {
    id: "q3_difficulty_freq",
    kind: "single",
    title: {
      en: "How often do you find it difficult to choose skincare or haircare products that suit your needs?",
      ti: "ንድሌታትኩም ዝሰማማዕ ናይ ክንክን ቆርበት ወይ ጸጉሪ ፍርያት ክትመርጹ ከለኹም፡ ማዕረ ክንደይ የጸግመኩም?",
    },
    options: [
      { id: "always", label: { en: "Always", ti: "ኩሉ ግዜ" } },
      { id: "sometimes", label: { en: "Sometimes", ti: "ሓደ ሓደ ግዜ" } },
      { id: "rarely", label: { en: "Rarely", ti: "ሳሕቲ" } },
      { id: "never", label: { en: "Never", ti: "ፈጺሙ ኣየጸግመንን" } },
    ],
  },
  {
    id: "q4_difficulties",
    kind: "multi",
    title: {
      en: "What difficulties do you face when choosing skincare or haircare products?",
      ti: "ናይ ክንክን ቆርበት ወይ ጸጉሪ ፍርያት ክትመርጹ ከለኹም፡ እንታይ ጸገማት የጋጥመኩም?",
    },
    hint: SELECT_ALL,
    options: [
      {
        id: "which_suit",
        label: {
          en: "Not knowing which products suit my needs",
          ti: "ንድሌታተይ ዝሰማማዕ ፍርያት ምፍላጥ",
        },
      },
      {
        id: "ingredients",
        label: {
          en: "Understanding cosmetic ingredients",
          ti: "ኣብ ፍርያት ዘለዉ ትሕዝቶ ምርዳእ",
        },
      },
      {
        id: "affordable",
        label: { en: "Finding affordable products", ti: "ብተመጣጣኒ ዋጋ ፍርያት ምርካብ" },
      },
      {
        id: "routine",
        label: {
          en: "Knowing how to use products or build a routine",
          ti: "ፍርያት ብኸመይ ከም ዝጥቀመሎም ወይ ዕለታዊ ናይ ክንክን ልምዲ ብኸመይ ከም ዘማዓዕብል ምፍላጥ",
        },
      },
      {
        id: "reliable_info",
        label: {
          en: "Finding reliable skincare or haircare information",
          ti: "ዘተኣማምን ሓበሬታ ምርካብ",
        },
      },
      {
        id: "none",
        exclusive: true,
        label: {
          en: "I don't experience any difficulties",
          ti: "ዝኾነ ጸገም የብለይን",
        },
      },
      { id: "other", other: true, label: OTHER },
    ],
  },
  {
    id: "q5_sources",
    kind: "multi",
    title: {
      en: "Where do you currently get skincare and haircare information or product recommendations?",
      ti: "ንክንክን ቆርበትን ጸጉርን ዝምልከት ሓበሬታ ወይ ምኽሪ ካበይ ትረኽቡ?",
    },
    hint: SELECT_ALL,
    options: [
      // Version 2 merges "TikTok or Instagram" + "YouTube" into one option.
      { id: "social_media", label: { en: "Social media", ti: "ማሕበራዊ መራኸቢታት" } },
      {
        id: "friends_family",
        label: { en: "Friends and family", ti: "ካብ ኣዕሩኽትን ስድራቤትን" },
      },
      {
        id: "store_staff",
        label: {
          en: "Beauty store employees",
          ti: "ካብ ሰራሕተኛታት ድኳናት መመላኽዕን ክንክን ቆርበትን",
        },
      },
      {
        id: "web_google",
        label: { en: "Websites or Google", ti: "ካብ ወብሳይታት ወይ ጉግል" },
      },
      {
        id: "health_professionals",
        label: { en: "Healthcare professionals", ti: "ካብ ሰብ ሞያ ጥዕና" },
      },
      { id: "other", other: true, label: OTHER },
    ],
  },
  {
    id: "q6_label_confidence",
    kind: "single",
    title: {
      en: "How confident are you in understanding cosmetic ingredient labels?",
      ti: "ኣብ ናይ ክንክን ቆርበትን ጸጉርን ፍርያት ዝርከቡ ትሕዝቶ ንምርዳእ ኣብ ፍልጠትኩም ማዕረ ክንደይ ትትአማመኑ?",
    },
    options: [
      { id: "very", label: { en: "Very confident", ti: "ኣዝየ እተኣማመን" } },
      {
        id: "somewhat",
        label: { en: "Somewhat confident", ti: "ብመጠኑ እተኣማመን" },
      },
      { id: "not", label: { en: "Not confident", ti: "ኣይተኣማመንን" } },
      {
        id: "dont_read",
        label: {
          en: "I don't usually read ingredient labels",
          ti: "መብዛሕትኡ ግዜ ዝርዝር ትሕዝቶ ኣየንብብን ኢየ",
        },
      },
    ],
  },
  {
    id: "q8_purchase_drivers",
    kind: "multi",
    max: 3,
    title: {
      en: "When choosing a new skincare or haircare product, what usually influences your final purchase decision the most?",
      ti: "ሓድሽ ናይ ክንክን ቆርበት ወይ ጸጉሪ ፍርያት ክትገዝኡ ከለኹም፡ ኣብ ውሳነኹም ዝያዳ ጽልዋ ዝገብሩ ነገራት ኣየኖት እዮም?",
    },
    hint: UP_TO_THREE,
    options: [
      {
        id: "price",
        label: { en: "Price and affordability", ti: "ዋጋን ተመጣጣንነቱን" },
      },
      {
        id: "ingredients",
        label: { en: "Product ingredients", ti: "ኣብቲ ፍርያት ዘለዉ ትሕዝቶ" },
      },
      {
        id: "friends_family",
        label: {
          en: "Recommendations from friends or family",
          ti: "ምኽሪ ኣዕሩኽትን ስድራቤትን",
        },
      },
      {
        id: "reviews",
        label: {
          en: "Online reviews and ratings",
          ti: "ኣብ ኢንተርነት ዝርከቡ ርእይቶታትን ገምጋማትን",
        },
      },
      {
        id: "influencers",
        label: {
          en: "Social media influencers",
          ti: "ኣብ ማሕበራዊ መራኸቢታት ፍርያት ዘላልዩ ሰባት",
        },
      },
      { id: "brand", label: { en: "Brand reputation", ti: "ዝና ናይቲ ብራንድ" } },
      { id: "other", other: true, label: OTHER },
    ],
  },
  {
    id: "q7_language",
    kind: "single",
    title: {
      en: "Which language would you prefer for skincare and haircare information?",
      ti: "ብዛዕባ ክንክን ቆርበትን ጸጉርን ሓበሬታ ብምንታይ ቋንቋ ክትረኽቡ ትመርጹ?",
    },
    options: [
      { id: "tigrigna", label: { en: "Tigrigna", ti: "ትግርኛ" } },
      { id: "english", label: { en: "English", ti: "እንግሊዝኛ" } },
      {
        id: "both",
        label: { en: "Both Tigrigna and English", ti: "ብትግርኛን እንግሊዝኛን" },
      },
      { id: "other", other: true, label: OTHER },
    ],
  },
  {
    id: "q9_usefulness",
    kind: "single",
    title: {
      en: "How useful would you find an online service that helps you choose suitable skincare and haircare products based on your individual needs and in your preferred language?",
      ti: "ንውልቃዊ ድሌታትኩም ዝሰማማዕ ፍርያት፡ ብትደልይዎ ቋንቋ ንኽትመርጹ ዝሕግዘኩም ዲጂታላዊ ኣገልግሎት ክንደይ ጠቓሚ ይመስለኩም?",
    },
    options: [
      { id: "very", label: { en: "Very useful", ti: "ኣዝዩ ጠቓሚ" } },
      { id: "somewhat", label: { en: "Somewhat useful", ti: "ብመጠኑ ጠቓሚ" } },
      { id: "not", label: { en: "Not useful", ti: "ጠቓሚ ኣይኮነን" } },
    ],
  },
  {
    id: "q10_features",
    kind: "multi",
    max: 3,
    title: {
      en: "What features or information would you most like to see on a skincare and haircare recommendation website?",
      ti: "ኣብ ናይ ክንክን ቆርበትን ጸጉርን ምኽሪ ዝህብ ወብሳይት፡ ካብዞም ዝስዕቡ ኣገልግሎታት ኣየኖት ክትረኽቡ ትደልዩ?",
    },
    hint: UP_TO_THREE,
    options: [
      {
        id: "personalized",
        label: {
          en: "Personalized product recommendations",
          ti: "ንውልቃዊ ድሌታተይ ዝሰማማዕ ናይ ፍርያት ምኽሪ",
        },
      },
      {
        id: "ingredient_science",
        label: {
          en: "Detailed scientific explanations of ingredients",
          ti: "ዝርዝር ሳይንሳዊ መብርሂ ብዛዕባ ፍርያት ዘለዉ ትሕዝቶ",
        },
      },
      {
        id: "affordable_alternatives",
        label: {
          en: "Affordable product alternatives",
          ti: "ብተመጣጣኒ ዋጋ ዝርከቡ ካልኦት ኣማራጺ ፍርያት",
        },
      },
      {
        id: "routines",
        label: {
          en: "Step-by-step skincare or haircare routines",
          ti: "ዕለታዊ ክንክን ቆርበት ወይ ጸጉሪ ብደረጃ ዝገልጽ መምርሒ",
        },
      },
      {
        id: "comparisons",
        label: { en: "Product comparisons", ti: "ንዝተፈላለዩ ፍርያት ምንጽጻር" },
      },
      {
        id: "education",
        label: {
          en: "Educational content in Tigrigna and/or English",
          ti: "ትምህርታዊ ሓበሬታ ብትግርኛ ወይ ብእንግሊዝኛ",
        },
      },
      { id: "other", other: true, label: OTHER },
    ],
  },
];

/** Answers as stored: question id → chosen option ids, plus free text for "other". */
export type Answer = { choices: string[]; other?: string };
export type Answers = Record<string, Answer>;

export const OTHER_MAX_LENGTH = 200;

/** Returns true when a question has a complete, valid answer. Shared by client and server. */
export function isAnswered(q: Question, a: Answer | undefined): boolean {
  if (!a || a.choices.length === 0) return false;
  const ids = new Set(q.options.map((o) => o.id));
  if (!a.choices.every((c) => ids.has(c))) return false;
  if (new Set(a.choices).size !== a.choices.length) return false;
  if (q.kind === "single" && a.choices.length !== 1) return false;
  if (q.max && a.choices.length > q.max) return false;
  const exclusive = q.options.find((o) => o.exclusive);
  if (exclusive && a.choices.includes(exclusive.id) && a.choices.length > 1)
    return false;
  const otherOpt = q.options.find((o) => o.other);
  if (otherOpt && a.choices.includes(otherOpt.id)) {
    const text = a.other?.trim() ?? "";
    if (text.length === 0 || text.length > OTHER_MAX_LENGTH) return false;
  }
  return true;
}
