export function StatCards({
  stats,
}: {
  stats: { total: number; ti: number; en: number; lastWeek: number };
}) {
  const items = [
    { label: "Total responses", value: stats.total },
    { label: "In Tigrinya", value: stats.ti },
    { label: "In English", value: stats.en },
    { label: "Last 7 days", value: stats.lastWeek },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <div
          key={i.label}
          className="rounded-xl border border-line bg-card px-4 py-3 shadow-[var(--shadow-soft)]"
        >
          <dt className="text-sm text-muted">{i.label}</dt>
          <dd className="m-0 text-2xl font-semibold tabular-nums text-fg">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
