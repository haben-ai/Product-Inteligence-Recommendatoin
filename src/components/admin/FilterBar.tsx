import Link from "next/link";
import { filtersToQuery, type Filters } from "@/lib/survey-stats";

/** Plain GET form: filters live in the URL, so views can be bookmarked and shared. */
export function FilterBar({ filters }: { filters: Filters }) {
  const hasFilters = !!(filters.lang || filters.from || filters.to);
  return (
    <form
      method="get"
      action="/admin"
      className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-card p-4 shadow-[var(--shadow-soft)]"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Survey language
        <select name="lang" defaultValue={filters.lang ?? ""} className="text-field min-h-11 py-0">
          <option value="">All languages</option>
          <option value="ti">Tigrinya</option>
          <option value="en">English</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        From
        <input type="date" name="from" defaultValue={filters.from} className="text-field min-h-11 py-0" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        To
        <input type="date" name="to" defaultValue={filters.to} className="text-field min-h-11 py-0" />
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
  );
}
