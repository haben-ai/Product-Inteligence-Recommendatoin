"use server";

import {
  OTHER_MAX_LENGTH,
  SURVEY_VERSION,
  isAnswered,
  questions,
  type Answers,
} from "@/content/survey";
import { isLocale } from "@/content/ui";
import { getSupabase } from "@/lib/supabase";

export type SubmitResult = { ok: true } | { ok: false };

/**
 * Saves one anonymous survey response. Anyone can call this endpoint directly,
 * so every field is re-validated against the question definitions here.
 */
export async function submitSurvey(input: {
  lang: string;
  answers: unknown;
  /** Honeypot: hidden from people, often filled in by bots. */
  website?: string;
}): Promise<SubmitResult> {
  if (input.website) return { ok: true }; // pretend success to bots, store nothing

  if (typeof input.lang !== "string" || !isLocale(input.lang)) return { ok: false };
  const raw = input.answers;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false };

  // Rebuild the answers from known questions only, dropping anything unexpected.
  const clean: Answers = {};
  for (const q of questions) {
    const a = (raw as Record<string, unknown>)[q.id] as
      | { choices?: unknown; other?: unknown }
      | undefined;
    if (!a || !Array.isArray(a.choices) || !a.choices.every((c) => typeof c === "string")) {
      return { ok: false };
    }
    const choices = a.choices as string[];
    const otherOpt = q.options.find((o) => o.other);
    const wantsOther = !!otherOpt && choices.includes(otherOpt.id);
    const other =
      wantsOther && typeof a.other === "string" ? a.other.trim().slice(0, OTHER_MAX_LENGTH) : undefined;
    const answer = other ? { choices, other } : { choices };
    if (!isAnswered(q, answer)) return { ok: false };
    clean[q.id] = answer;
  }

  const supabase = getSupabase();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[survey] Supabase not configured — response not saved:", JSON.stringify(clean));
      return { ok: true };
    }
    console.error("[survey] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set");
    return { ok: false };
  }

  const { error } = await supabase
    .from("survey_responses")
    .insert({ lang: input.lang, survey_version: SURVEY_VERSION, answers: clean });

  if (error) {
    console.error("[survey] insert failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}
