"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

/**
 * The woven tibeb border found on habesha cotton, drawn as a repeating SVG pattern.
 * `progress` (0–1) weaves the band from left to right; the unwoven part shows bare warp threads.
 * Omit `progress` for a fully woven, decorative band.
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
  /** Weave the band in from the left on first render (the page-load moment). */
  weaveIn?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const woven = progress === undefined ? 1 : Math.min(1, Math.max(0, progress));
  const isProgress = progress !== undefined;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height }}
      {...(isProgress
        ? {
            role: "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": Math.round(woven * 100),
            "aria-label": label,
          }
        : { "aria-hidden": true })}
    >
      {/* Bare warp threads */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={`warp-${id}`} width="6" height={height} patternUnits="userSpaceOnUse">
            <rect x="2.5" width="1" height={height} fill="var(--thread)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#warp-${id})`} />
      </svg>

      {/* Woven band */}
      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden"
        initial={weaveIn && !reduce ? { width: "0%" } : false}
        animate={{ width: `${woven * 100}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : weaveIn
              ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
              : { type: "spring", stiffness: 120, damping: 22 }
        }
      >
        <svg className="h-full" style={{ width: "100vw", maxWidth: "none" }} aria-hidden>
          <defs>
            <pattern
              id={`tibeb-${id}`}
              width="36"
              height={height}
              patternUnits="userSpaceOnUse"
            >
              <rect width="36" height={height} fill="var(--tibeb-green)" />
              <rect y="0" width="36" height="3" fill="var(--tibeb-gold)" />
              <rect y={height - 3} width="36" height="3" fill="var(--tibeb-gold)" />
              {/* diamond */}
              <path
                d={`M18 ${height / 2 - 6} L24 ${height / 2} L18 ${height / 2 + 6} L12 ${height / 2} Z`}
                fill="var(--tibeb-gold)"
              />
              <path
                d={`M18 ${height / 2 - 2.5} L20.5 ${height / 2} L18 ${height / 2 + 2.5} L15.5 ${height / 2} Z`}
                fill="var(--tibeb-rose)"
              />
              {/* small cross centred on each tile seam (drawn as two halves) */}
              {[0, 36].map((x) => (
                <g key={x} fill="var(--cotton)">
                  <rect x={x - 2.5} y={height / 2 - 0.75} width="5" height="1.5" />
                  <rect x={x - 0.75} y={height / 2 - 2.5} width="1.5" height="5" />
                </g>
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#tibeb-${id})`} />
        </svg>
      </motion.div>
    </div>
  );
}
