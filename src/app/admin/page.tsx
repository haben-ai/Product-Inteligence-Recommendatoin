import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminDataError,
  buildStats,
  fetchResponses,
  parseFilters,
  summarize,
} from "@/lib/survey-stats";
import { StatCards } from "@/components/admin/StatCards";
import { FilterBar } from "@/components/admin/FilterBar";
import { QuestionChart } from "@/components/admin/QuestionChart";
import { ResponsesTable } from "@/components/admin/ResponsesTable";
import { logout } from "./actions";

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Tigrigna Beauty &amp; Care</p>
          <h1 className="font-display text-2xl">Survey responses</h1>
        </div>
      </header>
      {/* The session cookie and URL filters are request data, so they stream in behind Suspense. */}
      <Suspense fallback={<p className="text-muted">Loading responses…</p>}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;

  let rows;
  try {
    rows = await fetchResponses(filters);
  } catch (e) {
    const message = e instanceof AdminDataError ? e.message : "Could not load responses.";
    return (
      <div role="alert" className="rounded-xl border border-danger/40 bg-card p-5 text-danger">
        {message}
        <SignOut />
      </div>
    );
  }

  const stats = buildStats(rows);

  return (
    <>
      <div className="-mt-4 flex justify-end">
        <SignOut />
      </div>
      <StatCards stats={summarize(rows)} />
      <FilterBar filters={filters} />

      <section aria-labelledby="charts-heading" className="flex flex-col gap-4">
        <h2 id="charts-heading" className="font-display text-xl">
          Answers by question
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {stats.map((s, i) => (
            <QuestionChart key={s.question.id} stat={s} index={i} />
          ))}
        </div>
      </section>

      <section id="responses" aria-labelledby="table-heading" className="flex flex-col gap-4">
        <h2 id="table-heading" className="font-display text-xl">
          All responses
        </h2>
        <ResponsesTable rows={rows} page={page} filters={filters} />
      </section>
    </>
  );
}

function SignOut() {
  return (
    <form action={logout}>
      <button type="submit" className="btn-quiet">
        Sign out
      </button>
    </form>
  );
}
