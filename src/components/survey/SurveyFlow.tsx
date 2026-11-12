"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { isAnswered, questions, type Answers, type Locale } from "@/content/survey";
import { ui } from "@/content/ui";
import { submitSurvey } from "@/app/[lang]/survey/actions";
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress";
import { TibebBand } from "@/components/TibebBand";
import { QuestionStep } from "./QuestionStep";

const total = questions.length;

export function SurveyFlow({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const router = useRouter();
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const movedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();

  // Restore progress from this tab (also keeps answers when switching language).
  useEffect(() => {
    const p = loadProgress();
    /* eslint-disable react-hooks/set-state-in-effect -- reading browser-only storage after mount */
    if (p) {
      setAnswers(p.answers);
      setStep(Math.min(Math.max(0, p.step), total - 1));
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (ready) saveProgress({ step, answers });
  }, [ready, step, answers]);

  // Move focus to the new question for keyboard and screen-reader users (not on first load).
  useEffect(() => {
    if (!movedRef.current) return;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [step, reduce]);

  const q = questions[step];
  const a = answers[q.id];
  const answeredCount = questions.filter((qq) => isAnswered(qq, answers[qq.id])).length;

  // Handlers take the question explicitly: during a step transition the outgoing
  // question is still on screen, and its clicks must never land on the next one.
  function toggle(questionId: string, optionId: string) {
    const q = questions.find((qq) => qq.id === questionId);
    if (!q || !q.options.some((o) => o.id === optionId)) return;
    setError(null);
    setAnswers((prev) => {
      const cur = prev[q.id] ?? { choices: [] };
      let choices: string[];
      if (q.kind === "single") {
        choices = [optionId];
      } else if (cur.choices.includes(optionId)) {
        choices = cur.choices.filter((c) => c !== optionId);
      } else {
        const opt = q.options.find((o) => o.id === optionId);
        const exclusiveIds = q.options.filter((o) => o.exclusive).map((o) => o.id);
        if (opt?.exclusive) choices = [optionId];
        else choices = [...cur.choices.filter((c) => !exclusiveIds.includes(c)), optionId];
        if (q.max && choices.length > q.max) return prev;
      }
      const otherOpt = q.options.find((o) => o.other);
      const keepOther = otherOpt && choices.includes(otherOpt.id);
      return { ...prev, [q.id]: keepOther ? { choices, other: cur.other } : { choices } };
    });
  }

  function setOther(questionId: string, text: string) {
    const q = questions.find((qq) => qq.id === questionId);
    if (!q) return;
    setError(null);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { choices: prev[q.id]?.choices ?? [], other: text },
    }));
  }

  function go(to: number) {
    movedRef.current = true;
    setError(null);
    setDir(to > step ? 1 : -1);
    setStep(to);
  }

  function next() {
    if (!isAnswered(q, a)) {
      const otherOpt = q.options.find((o) => o.other);
      const missingOther = otherOpt && a?.choices.includes(otherOpt.id);
      setError(missingOther ? t.specifyMissing : t.pleaseChoose);
      headingRef.current?.focus();
      return;
    }
    if (step < total - 1) return go(step + 1);

    // Last question: if anything earlier is incomplete, take them back to it.
    const firstMissing = questions.findIndex((qq) => !isAnswered(qq, answers[qq.id]));
    if (firstMissing !== -1) return go(firstMissing);

    startSending(async () => {
      const res = await submitSurvey({
        lang,
        answers,
        website: honeypotRef.current?.value ?? "",
      }).catch(() => ({ ok: false as const }));
      if (!res.ok) {
        setError(t.submitError);
        return;
      }
      clearProgress();
      setAnswers({});
      setStep(0);
      movedRef.current = false;
      router.push(`/${lang}/thanks`);
    });
  }

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0, pointerEvents: "auto" as const },
    // The outgoing question ignores taps while it animates away.
    exit: (d: number) =>
      reduce
        ? { opacity: 0, pointerEvents: "none" as const }
        : { opacity: 0, x: d * -32, pointerEvents: "none" as const },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 -mx-4 bg-bg pt-2 pb-1 sm:mx-0">
        <TibebBand progress={answeredCount / total} label={t.questionOf(step + 1, total)} />
      </div>

      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        noValidate
        aria-busy={sending || undefined}
      >
        {/* Honeypot: invisible to people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="min-h-[24rem]">
          {ready && (
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={q.id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuestionStep
                  ref={headingRef}
                  lang={lang}
                  question={q}
                  answer={a}
                  index={step}
                  total={total}
                  error={error}
                  onToggle={(optionId) => toggle(q.id, optionId)}
                  onOther={(text) => setOther(q.id, text)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" className="btn-quiet" onClick={() => go(step - 1)}>
              {t.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn-primary" disabled={sending || !ready}>
            {sending ? t.sending : step === total - 1 ? t.submit : t.next}
          </button>
        </div>
      </form>
    </div>
  );
}
