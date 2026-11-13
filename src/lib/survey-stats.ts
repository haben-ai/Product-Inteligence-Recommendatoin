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

// ---------- Overview charts ----------

export type DayCount = { date: string; count: number };

/** Responses per UTC day over a window (the filter range, or the last 30 days). */
export function dailyCounts(rows: ResponseRow[], f: Filters): DayCount[] {
  const DAY = 24 * 60 * 60 * 1000;
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  let end = f.to ? Date.parse(`${f.to}T00:00:00Z`) : today;
  let start = f.from ? Date.parse(`${f.from}T00:00:00Z`) : end - 29 * DAY;
  if (start > end) [start, end] = [end, start];
  if ((end - start) / DAY > 89) start = end - 89 * DAY; // cap at 90 columns
  const counts = new Map<string, number>();
  for (const r of rows) {
    const d = r.created_at.slice(0, 10);
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const out: DayCount[] = [];
  for (let t = start; t <= end; t += DAY) {
    const d = new Date(t).toISOString().slice(0, 10);
    out.push({ date: d, count: counts.get(d) ?? 0 });
  }
  return out;
}

export type Segment = { id: string; label: string; count: number; share: number };
export type CrossRow = { id: string; label: string; n: number; segments: Segment[] };

/** For each answer of `rowQ` (e.g. age), how answers to `colQ` (e.g. usefulness) split. */
export function crossTab(rows: ResponseRow[], rowQId: string, colQId: string): CrossRow[] {
  const rowQ = questions.find((q) => q.id === rowQId)!;
  const colQ = questions.find((q) => q.id === colQId)!;
  return rowQ.options.map((ro) => {
    const group = rows.filter((r) => r.answers?.[rowQ.id]?.choices.includes(ro.id));
    const answered = group.filter((r) => (r.answers?.[colQ.id]?.choices.length ?? 0) > 0);
    const n = answered.length;
    return {
      id: ro.id,
      label: ro.label.en,
      n,
      segments: colQ.options.map((co) => {
        const count = answered.filter((r) => r.answers[colQ.id].choices.includes(co.id)).length;
        return { id: co.id, label: co.label.en, count, share: n ? count / n : 0 };
      }),
    };
  });
}

export type Insight = { label: string; value: number | null; detail: string };

/** Headline numbers for the business questions the survey exists to answer. */
export function insights(rows: ResponseRow[]): Insight[] {
  const share = (qId: string, ids: string[]) => {
    const answered = rows.filter((r) => (r.answers?.[qId]?.choices.length ?? 0) > 0);
    const hits = answered.filter((r) => r.answers[qId].choices.some((c) => ids.includes(c)));
    return { value: answered.length ? hits.length / answered.length : null, n: answered.length, hits: hits.length };
  };
  const top = (qId: string, exclude: string[]) => {
    const q = questions.find((x) => x.id === qId)!;
    const stat = buildStats(rows).find((s) => s.question.id === qId)!;
    const best = stat.options.find((o) => !exclude.includes(o.id) && o.count > 0);
    return { q, best, n: stat.answered };
  };
  const useful = share("q9_usefulness", ["very", "somewhat"]);
  const tig = share("q7_language", ["tigrigna", "both"]);
  const struggle = share("q3_difficulty_freq", ["always", "sometimes"]);
  const labels = share("q6_label_confidence", ["not", "dont_read"]);
  const diff = top("q4_difficulties", ["none", "other"]);
  const feat = top("q10_features", ["other"]);
  const of = (s: { hits: number; n: number }) => `${s.hits} of ${s.n} people`;
  return [
    { label: "Would find the site useful", value: useful.value, detail: `Very or somewhat useful · ${of(useful)}` },
    { label: "Want Tigrinya content", value: tig.value, detail: `Tigrigna or both languages · ${of(tig)}` },
    { label: "Find choosing products hard", value: struggle.value, detail: `Always or sometimes · ${of(struggle)}` },
    { label: "Unsure about ingredient labels", value: labels.value, detail: `Not confident or don't read them · ${of(labels)}` },
    {
      label: "Top difficulty",
      value: diff.best ? diff.best.share : null,
      detail: diff.best ? diff.best.label : "No answers yet",
    },
    {
      label: "Most wanted feature",
      value: feat.best ? feat.best.share : null,
      detail: feat.best ? feat.best.label : "No answers yet",
    },
  ];
}
