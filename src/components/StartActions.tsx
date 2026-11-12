"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/survey";
import { ui } from "@/content/ui";
import { clearProgress, loadProgress } from "@/lib/progress";

export function StartActions({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const router = useRouter();
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage after mount
    setHasProgress(!!p && Object.keys(p.answers).length > 0);
  }, []);

  return (
    <div className="flex flex-col items-start gap-3">
      <Link href={`/${lang}/survey`} className="btn-primary">
        {hasProgress ? t.resume : t.start}
      </Link>
      {hasProgress && (
        <button
          type="button"
          className="btn-quiet"
          onClick={() => {
            clearProgress();
            router.push(`/${lang}/survey`);
          }}
        >
          {t.restart}
        </button>
      )}
    </div>
  );
}
