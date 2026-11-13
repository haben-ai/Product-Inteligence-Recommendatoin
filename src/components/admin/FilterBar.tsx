import Link from "next/link";
import { filtersToQuery, type Filters } from "@/lib/survey-stats";

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

/** Plain GET form + date presets: filters live in the URL, so views can be bookmarked and shared. */
export function FilterBar({ filters }: { filters: Filters }) {
  const hasFilters = !!(filters.lang || filters.from || filters.to);
  const today = daysAgo(0);
  const presets = [7, 30, 90].map((n) => ({
    label: `Last ${n} days`,
    from: daysAgo(n - 1),
    href: `/admin${filtersToQuery({ lang: filters.lang, from: daysAgo(n - 1), to: today })}`,
  }));
  return (
    <div className="flex flex-col gap-2">
      <nav aria-label="Date presets" className="flex flex-wrap gap-2 text-sm">
        {presets.map((p) => {
          const active = filters.from === p.from && filters.to === today;
          return (
            <a
              key={p.label}
              href={p.href}
              aria-current={active ? "true" : undefined}
              className={
                "inline-flex min-h-11 items-center rounded-full border px-4 transition-colors duration-200 " +
                (active
                  ? "border-fg bg-fg text-bg"
                  : "border-line bg-card text-fg hover:border-secondary")
              }
            >
              {p.label}
            </a>
          );
        })}
      </nav>
      <form
        method="get"
        action="/admin"
        className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Survey language
          <select
            name="lang"
            defaultValue={filters.lang ?? ""}
            className="text-field min-h-11 py-0"
          >
            <option value="">All languages</option>
            <option value="ti">Tigrinya</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          From
          <input
            type="date"
            name="from"
            defaultValue={filters.from}
            className="text-field min-h-11 py-0"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          To
          <input
            type="date"
            name="to"
            defaultValue={filters.to}
            className="text-field min-h-11 py-0"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn-primary min-h-11 px-6">
            Apply filters
          </button>
          {hasFilters && (
            <Link href="/admin" className="btn-quiet ml-0">
              Clear
            </Link>
          )}
        </div>
        <a
          href={`/admin/export${filtersToQuery(filters)}`}
          className="link ml-auto inline-flex min-h-11 items-center text-sm font-medium"
          download
        >
          Download CSV
        </a>
      </form>
    </div>
  );
}
