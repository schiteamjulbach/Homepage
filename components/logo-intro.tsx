"use client";

import { useEffect, useState } from "react";

/** Covers the initial data load only; background refreshes never replay it. */
export function LogoIntro({ ready }: { ready: boolean }) {
  const [expired, setExpired] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const leaving = ready || expired;

  useEffect(() => {
    const timer = window.setTimeout(() => setExpired(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    const timer = window.setTimeout(() => setDismissed(true), delay);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (dismissed) return null;

  return (
    <div className={`logo-intro${leaving ? " logo-intro-leaving" : ""}`} aria-hidden="true">
      <img className="logo-intro-image" src="/schiteam-logo.png" alt="" width={600} height={600} fetchPriority="high" />
    </div>
  );
}
