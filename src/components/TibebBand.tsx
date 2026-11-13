"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Top band: a solid strip in the same wine as the active language button.
 * `progress` (0–1) fills it from left to right over a light track (survey progress bar).
 * Omit `progress` for a full, decorative band.
 */
export function TibebBand({
  progress,
  height = 22,
  label,
  weaveIn = false,
}: {
  progress?: number;
  height?: number;
  label?: string;
  /** Fill the band in from the left on first render (the page-load moment). */
  weaveIn?: boolean;
}) {
  const reduce = useReducedMotion();
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
      <motion.div
        className="absolute inset-y-0 left-0 bg-fg"
        initial={weaveIn && !reduce ? { width: "0%" } : false}
        animate={{ width: `${filled * 100}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : weaveIn
              ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
              : { type: "spring", stiffness: 120, damping: 22 }
        }
      />
    </div>
  );
}
