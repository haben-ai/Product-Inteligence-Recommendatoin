import "server-only";
import { questions, type Answers, type Locale, type Question } from "@/content/survey";
import { getSupabaseAdmin } from "./supabase-admin";

export type ResponseRow = {
  id: string;
  created_at: string;
  lang: Locale;
  survey_version: number;
  answers: Answers;
};

export type Filters = { lang?: Locale; from?: string; to?: string };

/** Short column names for the table and CSV, in question order. */
export const SHORT_LABELS: Record<string, string> = {
  q1_age: "Age",
  q2_interest: "Interest",
  q3_difficulty_freq: "Difficulty choosing",
  q4_difficulties: "Difficulties",
  q5_sources: "Info sources",
  q6_label_confidence: "Label confidence",
  q7_language: "Preferred language",
  q8_purchase_drivers: "Purchase drivers",
  q9_usefulness: "Site usefulness",
  q10_features: "Wanted features",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const lang = one("lang");
  const from = one("from");
  const to = one("to");
  return {
    lang: lang === "ti" || lang === "en" ? lang : undefined,
    from: from && DATE_RE.test(from) ? from : undefined,
    to: to && DATE_RE.test(to) ? to : undefined,
  };
}

export function filtersToQuery(f: Filters, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams();
  if (f.lang) p.set("lang", f.lang);
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export class AdminDataError extends Error {}

/** All responses matching the filters, newest first (paged 1,000 rows at a time). */
export async function fetchResponses(f: Filters): Promise<ResponseRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new AdminDataError("SUPABASE_SECRET_KEY is not set on the server.");

  const rows: ResponseRow[] = [];
  const PAGE = 1000;
  for (let start = 0; ; start += PAGE) {
    let q = supabase
      .from("survey_responses")
      .select("id, created_at, lang, survey_version, answers")
      .order("created_at", { ascending: false })
      .range(start, start + PAGE - 1);
    if (f.lang) q = q.eq("lang", f.lang);
    if (f.from) q = q.gte("created_at", `${f.from}T00:00:00Z`);
    if (f.to) q = q.lte("created_at", `${f.to}T23:59:59.999Z`);
    const { data, error } = await q;
    if (error) throw new AdminDataError(`Could not load responses: ${error.message}`);
    rows.push(...((data ?? []) as ResponseRow[]));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

export function optionLabel(q: Question, id: string): string {
  return q.options.find((o) => o.id === id)?.label.en ?? id;
}

/** Readable English answer for one question, e.g. "Price and affordability; Other: …". */
export function answerText(q: Question, row: ResponseRow): string {
  const a = row.answers?.[q.id];
  if (!a) return "";
  const parts = a.choices.map((c) => {
    const opt = q.options.find((o) => o.id === c);
    if (opt?.other && a.other) return `Other: ${a.other}`;
    return optionLabel(q, c);
  });
  return parts.join("; ");
}

export type OptionStat = { id: string; label: string; count: number; share: number };
export type QuestionStat = {
  question: Question;
  answered: number;
  options: OptionStat[];
  others: { text: string; lang: Locale; date: string }[];
};

export function buildStats(rows: ResponseRow[]): QuestionStat[] {
  return questions.map((q) => {
    const counts = new Map(q.options.map((o) => [o.id, 0]));
    const others: QuestionStat["others"] = [];
    let answered = 0;
    for (const r of rows) {
      const a = r.answers?.[q.id];
      if (!a || a.choices.length === 0) continue;
      answered++;
      for (const c of a.choices) if (counts.has(c)) counts.set(c, (counts.get(c) ?? 0) + 1);
      if (a.other) others.push({ text: a.other, lang: r.lang, date: r.created_at });
    }
    const options = q.options
      .map((o, i) => ({
        id: o.id,
        label: o.label.en,
        count: counts.get(o.id) ?? 0,
        share: answered ? (counts.get(o.id) ?? 0) / answered : 0,
        i,
      }))
      .sort((a, b) => b.count - a.count || a.i - b.i)
      .map((o) => ({ id: o.id, label: o.label, count: o.count, share: o.share }));
    return { question: q, answered, options, others };
  });
}

export function summarize(rows: ResponseRow[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    total: rows.length,
    ti: rows.filter((r) => r.lang === "ti").length,
    en: rows.filter((r) => r.lang === "en").length,
    lastWeek: rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length,
  };
}

function csvCell(raw: string): string {
  // Neutralise spreadsheet formulas in visitor-typed text (CSV injection).
  const v = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** CSV with readable English labels; BOM so Excel opens Tigrinya text correctly. */
export function toCsv(rows: ResponseRow[]): string {
  const header = ["Response ID", "Submitted (UTC)", "Survey language", ...questions.map((q) => SHORT_LABELS[q.id] ?? q.id)];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.created_at.replace("T", " ").slice(0, 19),
        r.lang === "ti" ? "Tigrinya" : "English",
        ...questions.map((q) => answerText(q, r)),
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return "﻿" + lines.join("\r\n") + "\r\n";
}
