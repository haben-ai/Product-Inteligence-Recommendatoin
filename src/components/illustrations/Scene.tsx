import { sceneContent, type SceneName } from "./scenes";

/**
 * Responsive illustration frame.
 * - Phone/tablet: a compact wide banner (the 4:3 drawing is cropped to its centre band),
 *   so answer options stay on screen.
 * - Desktop (≥1024px), variant "panel": the full 4:3 drawing in a panel that stays in view.
 * Decorative: the text beside it carries the meaning, so it is hidden from screen readers.
 */
export function Scene({
  name,
  variant = "banner",
  className = "",
}: {
  name: SceneName;
  variant?: "banner" | "panel";
  className?: string;
}) {
  return (
    <figure className={`scene scene--${variant} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" focusable="false">
        {sceneContent(name)}
      </svg>
    </figure>
  );
}
