import type { CSSProperties } from "react";
import type { CrossRow, DayCount, Insight } from "@/lib/survey-stats";

const pct = (n: number) => `${Math.round(n * 100)}%`;
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function Card({ title, sub, children, className = "" }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-4 rounded-xl border border-line bg-card p-5 shadow-[var(--shadow-soft)] ${className}`}>
      <header className="flex flex-col gap-1">
        <h3 className="text-base leading-snug font-semibold text-fg">{title}</h3>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </header>
      {children}
    </section>
  );
}

/** Hero numbers: the business questions the survey exists to answer. Not charts — stat tiles. */
export function InsightTiles({ items }: { items: Insight[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="flex flex-col gap-1 rounded-xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-muted">{i.label}</p>
          <p className="m-0 text-3xl leading-none font-semibold tabular-nums text-fg">
            {i.value === null ? "—" : pct(i.value)}
          </p>
          <p className="text-sm text-muted">{i.detail}</p>
        </div>
      ))}
    </div>
  );
}

/** Change over time: one series, columns per day, value in the tooltip. */
export function DailyColumns({ days }: { days: DayCount[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((a, d) => a + d.count, 0);
  const align = (i: number) => (i < days.length * 0.15 ? "start" : i > days.length * 0.85 ? "end" : undefined);

  return (
    <Card
      title="Responses per day"
      sub={`${total} in ${days.length} days · ${shortDate(days[0].date)} – ${shortDate(days[days.length - 1].date)}`}
      className="lg:col-span-2"
    >
      <div className="flex gap-2">
        {/* y-axis: recessive, just the top value and zero */}
        <div className="flex h-40 flex-col justify-between text-right text-xs tabular-nums text-muted" aria-hidden>
          <span>{max}</span>
          <span>0</span>
        </div>
        <div className="relative flex h-40 flex-1 items-end gap-[2px] border-b border-muted/40">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-line" aria-hidden />
          {days.map((d, i) => (
            <div
              key={d.date}
              tabIndex={0}
              className="chart-hit flex h-full min-w-0 flex-1 items-end justify-center"
              aria-label={`${shortDate(d.date)}: ${d.count} ${d.count === 1 ? "response" : "responses"}`}
            >
              <div
                className="chart-mark w-full max-w-6 rounded-t-[4px] bg-[var(--chart-cat-1)]"
                style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 2 : 0 }}
              />
              <span className="chart-tip" data-align={align(i)} aria-hidden>
                <strong>
                  {d.count} {d.count === 1 ? "response" : "responses"}
                </strong>
                {shortDate(d.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between pl-6 text-xs text-muted" aria-hidden>
        <span>{shortDate(days[0].date)}</span>
        <span>{shortDate(days[days.length - 1].date)}</span>
      </div>
    </Card>
  );
}

/** One whole split into parts: survey language. */
export function LanguageSplit({ ti, en }: { ti: number; en: number }) {
  const total = ti + en;
  const parts = [
    { key: "ti", label: "Tigrinya", count: ti, color: "var(--chart-cat-1)" },
    { key: "en", label: "English", count: en, color: "var(--chart-cat-2)" },
  ].filter((p) => p.count > 0);

  return (
    <Card title="Survey language" sub={`Which language people answered in · ${total} responses`}>
      {total === 0 ? (
        <p className="text-sm text-muted">No responses yet.</p>
      ) : (
        <>
          <div className="flex h-10 w-full gap-[2px]">
            {parts.map((p, i) => (
              <div
                key={p.key}
                tabIndex={0}
                className="chart-hit h-full"
                style={{ width: `${(p.count / total) * 100}%` }}
                aria-label={`${p.label}: ${p.count} of ${total} (${pct(p.count / total)})`}
              >
                <div
                  className="chart-mark h-full"
                  style={{
                    background: p.color,
                    borderRadius: `${i === 0 ? 4 : 0}px ${i === parts.length - 1 ? 4 : 0}px ${i === parts.length - 1 ? 4 : 0}px ${i === 0 ? 4 : 0}px`,
                  }}
                />
                <span className="chart-tip" data-align={i === 0 ? "start" : "end"} aria-hidden>
                  <strong>
                    {pct(p.count / total)} · {p.count}
                  </strong>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <Legend
            items={[
              { label: `Tigrinya — ${ti} (${pct(total ? ti / total : 0)})`, color: "var(--chart-cat-1)" },
              { label: `English — ${en} (${pct(total ? en / total : 0)})`, color: "var(--chart-cat-2)" },
            ]}
          />
        </>
      )}
    </Card>
  );
}

const ORD = ["var(--chart-ord-3)", "var(--chart-ord-2)", "var(--chart-ord-1)"]; // very → not

/** 100% stacked bars: how useful each age group expects the site to be (ordinal, dark = more useful). */
export function UsefulnessByAge({ rows }: { rows: CrossRow[] }) {
  const legend = rows[0]?.segments.map((s, i) => ({ label: s.label, color: ORD[i] })) ?? [];
  const anyData = rows.some((r) => r.n > 0);

  return (
    <Card title="Expected usefulness by age group" sub="Share of each age group answering question 9">
      {!anyData ? (
        <p className="text-sm text-muted">No answers yet.</p>
      ) : (
        <>
          <Legend items={legend} />
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {rows.map((r) => (
              <li key={r.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3">
                <span className="text-sm text-fg">{r.label}</span>
                {r.n === 0 ? (
                  <span className="h-4 rounded-r-[4px] bg-tint" aria-label={`${r.label}: no answers`} />
                ) : (
                  <div className="flex h-4 w-full gap-[2px]">
                    {r.segments
                      .filter((s) => s.count > 0)
                      .map((s, i, arr) => {
                        const colour = ORD[r.segments.findIndex((x) => x.id === s.id)];
                        const style: CSSProperties = {
                          width: `${s.share * 100}%`,
                        };
                        return (
                          <div
                            key={s.id}
                            tabIndex={0}
                            className="chart-hit h-full"
                            style={style}
                            aria-label={`${r.label}, ${s.label}: ${s.count} of ${r.n} (${pct(s.share)})`}
                          >
                            <div
                              className="chart-mark h-full"
                              style={{ background: colour, borderRadius: i === arr.length - 1 ? "0 4px 4px 0" : 0 }}
                            />
                            <span className="chart-tip" aria-hidden>
                              <strong>
                                {pct(s.share)} · {s.count} of {r.n}
                              </strong>
                              {r.label} · {s.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
                <span className="text-right text-xs tabular-nums text-muted">n={r.n}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm text-fg">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-3 w-3 rounded-[3px]" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
