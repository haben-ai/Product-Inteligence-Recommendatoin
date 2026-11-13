import type { QuestionStat } from "@/lib/survey-stats";

const pct = (n: number) => `${Math.round(n * 100)}%`;

/**
 * One question = one single-series horizontal bar chart (no legend; the title names it).
 * Bars share a 0–100% scale (share of people who answered), so charts compare across questions.
 * Marks: ≤16px thick, square at the baseline, 4px rounded data-end; value at the tip in text colour.
 */
export function QuestionChart({ stat, index }: { stat: QuestionStat; index: number }) {
  const { question: q, answered, options, others } = stat;
  const multi = q.kind === "multi";

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          Question {index + 1} · {answered} answered
          {multi && (q.max ? ` · up to ${q.max} choices` : " · multiple choices")}
        </p>
        <h2 className="text-base leading-snug font-semibold text-fg">{q.title.en}</h2>
      </header>

      {answered === 0 ? (
        <p className="text-sm text-muted">No answers yet.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {options.map((o) => (
            <li
              key={o.id}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1"
              aria-label={`${o.label}: ${o.count} of ${answered} (${pct(o.share)})`}
            >
              <span className="text-sm text-fg">{o.label}</span>
              <span className="text-sm tabular-nums text-muted" aria-hidden>
                {o.count} · {pct(o.share)}
              </span>
              <div className="col-span-2 h-4 w-full bg-bg" aria-hidden title={`${o.count} of ${answered} (${pct(o.share)})`}>
                <div
                  className="h-full rounded-r-[4px] bg-primary-strong transition-[filter] duration-200 group-hover:brightness-110"
                  style={{ width: `${o.share * 100}%`, minWidth: o.count > 0 ? 2 : 0 }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {multi && answered > 0 && (
        <p className="text-sm text-muted">
          % = share of people who answered; people could pick more than one, so totals can pass 100%.
        </p>
      )}

      {others.length > 0 && (
        <details className="rounded-lg border border-line px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-fg">
            “Other” answers ({others.length})
          </summary>
          <ul className="mt-2 flex list-none flex-col gap-2 p-0 text-sm">
            {others.map((o, i) => (
              <li key={i} className="border-t border-line pt-2 first:border-0 first:pt-0">
                <span lang={o.lang} className="text-fg">
                  {o.text}
                </span>
                <span className="block text-muted">
                  {o.lang === "ti" ? "Tigrinya" : "English"} · {o.date.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
