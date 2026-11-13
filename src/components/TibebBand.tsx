/**
 * Top band: a solid strip in the same wine as the active language button.
 * `progress` (0–1) fills it from left to right over a light track (survey progress bar).
 * Omit `progress` for a full band. Static: no animation.
 */
export function TibebBand({
  progress,
  height = 22,
  label,
}: {
  progress?: number;
  height?: number;
  label?: string;
}) {
  const filled = progress === undefined ? 1 : Math.min(1, Math.max(0, progress));
  const isProgress = progress !== undefined;

  return (
    <div
      className="relative w-full overflow-hidden bg-line"
      style={{ height }}
      {...(isProgress
        ? {
            role: "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": Math.round(filled * 100),
            "aria-label": label,
          }
        : { "aria-hidden": true })}
    >
      <div className="absolute inset-y-0 left-0 bg-fg" style={{ width: `${filled * 100}%` }} />
    </div>
  );
}
