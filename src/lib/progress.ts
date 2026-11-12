import { SURVEY_VERSION, type Answers } from "@/content/survey";

/** In-progress survey state, kept only in this browser tab (sessionStorage). */
export type Progress = { version: number; step: number; answers: Answers };

const KEY = "tbc-survey-progress";

export function loadProgress(): Progress | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Progress;
    if (p.version !== SURVEY_VERSION || typeof p.step !== "number" || !p.answers) return null;
    return p;
  } catch {
    return null;
  }
}

export function saveProgress(p: Omit<Progress, "version">) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...p, version: SURVEY_VERSION }));
  } catch {
    // Private mode or storage disabled: the survey still works, it just won't survive a refresh.
  }
}

export function clearProgress() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
