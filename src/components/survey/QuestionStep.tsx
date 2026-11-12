"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { forwardRef } from "react";
import { OTHER_MAX_LENGTH, type Answer, type Locale, type Question } from "@/content/survey";
import { ui } from "@/content/ui";

type Props = {
  lang: Locale;
  question: Question;
  answer: Answer | undefined;
  index: number;
  total: number;
  error: string | null;
  onToggle: (optionId: string) => void;
  onOther: (text: string) => void;
};

/** One question: a fieldset of real radio/checkbox inputs, plus the optional "Other" text. */
export const QuestionStep = forwardRef<HTMLHeadingElement, Props>(function QuestionStep(
  { lang, question: q, answer, index, total, error, onToggle, onOther },
  headingRef,
) {
  const t = ui[lang];
  const reduce = useReducedMotion();
  const chosen = answer?.choices ?? [];
  const atMax = !!q.max && chosen.length >= q.max;
  const otherOpt = q.options.find((o) => o.other);
  const showOther = !!otherOpt && chosen.includes(otherOpt.id);
  const inputType = q.kind === "single" ? "radio" : "checkbox";
  const hintId = `${q.id}-hint`;
  const errorId = `${q.id}-error`;

  return (
    <fieldset
      className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0"
      aria-describedby={[q.hint ? hintId : "", error ? errorId : ""].join(" ").trim() || undefined}
    >
      <legend className="contents">
        <p className="mb-2 text-sm text-muted">{t.questionOf(index + 1, total)}</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className={
            "font-display text-pretty outline-none " +
            // Very long questions (e.g. Q9) drop one step so the options stay on screen.
            (q.title[lang].length > 140 ? "text-lg sm:text-xl" : "text-xl sm:text-2xl")
          }
        >
          {q.title[lang]}
        </h1>
      </legend>

      {q.hint && (
        <p id={hintId} className="-mt-3 text-sm text-muted">
          {q.hint[lang]}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {q.options.map((o) => {
          const checked = chosen.includes(o.id);
          const disabled = !checked && atMax;
          return (
            <label key={o.id} className="option">
              <input
                type={inputType}
                name={q.id}
                value={o.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(o.id)}
              />
              <span className="option-mark" data-kind={q.kind} aria-hidden>
                <AnimatePresence initial={false}>
                  {checked && (
                    <motion.svg
                      key="check"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    >
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        fill="none"
                        stroke="var(--card)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </span>
              <span className="text-pretty">{o.label[lang]}</span>
            </label>
          );
        })}
      </div>

      {atMax && q.max && (
        <p className="-mt-3 text-sm text-muted" aria-live="polite">
          {t.maxReached(q.max)}
        </p>
      )}

      <AnimatePresence initial={false}>
        {showOther && (
          <motion.div
            key="other"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            className="-mt-2 overflow-hidden"
          >
            <label className="flex flex-col gap-1 pt-1 text-sm">
              <span>{t.pleaseSpecify}</span>
              <input
                type="text"
                className="text-field"
                maxLength={OTHER_MAX_LENGTH}
                value={answer?.other ?? ""}
                onChange={(e) => onOther(e.target.value)}
                aria-invalid={error && !answer?.other?.trim() ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                autoComplete="off"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p id={errorId} role="alert" className="-mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
});
