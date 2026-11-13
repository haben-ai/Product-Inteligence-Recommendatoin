import Link from "next/link";
import { questions } from "@/content/survey";
import {
  SHORT_LABELS,
  answerText,
  filtersToQuery,
  type Filters,
  type ResponseRow,
} from "@/lib/survey-stats";

export const PAGE_SIZE = 50;

export function ResponsesTable({
  rows,
  page,
  filters,
}: {
  rows: ResponseRow[];
  page: number;
  filters: Filters;
}) {
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const slice = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  if (rows.length === 0) {
    return <p className="text-sm text-muted">No responses match these filters.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="overflow-x-auto rounded-xl border border-line bg-card shadow-[var(--shadow-soft)]"
        tabIndex={0}
        role="region"
        aria-label="Responses table, scrolls sideways"
      >
        <table className="w-full min-w-[72rem] border-collapse text-left text-sm">
          <thead className="bg-tint text-fg">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                Submitted
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Lang
              </th>
              {questions.map((q) => (
                <th key={q.id} scope="col" className="px-3 py-2 font-semibold">
                  {SHORT_LABELS[q.id]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className="border-t border-line align-top hover:bg-tint">
                <td className="px-3 py-2 whitespace-nowrap tabular-nums text-muted">
                  {r.created_at.slice(0, 16).replace("T", " ")}
                </td>
                <td className="px-3 py-2 text-muted">{r.lang.toUpperCase()}</td>
                {questions.map((q) => (
                  <td key={q.id} className="max-w-[16rem] px-3 py-2 text-fg">
                    {answerText(q, r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Table pages" className="flex items-center gap-3 text-sm">
          {current > 1 ? (
            <Link className="link" href={`/admin${filtersToQuery(filters, { page: String(current - 1) })}#responses`}>
              Newer
            </Link>
          ) : null}
          <span className="text-muted">
            Page {current} of {pages}
          </span>
          {current < pages ? (
            <Link className="link" href={`/admin${filtersToQuery(filters, { page: String(current + 1) })}#responses`}>
              Older
            </Link>
          ) : null}
        </nav>
      )}
    </div>
  );
}
