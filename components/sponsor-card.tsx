"use client";

import { useEffect, useState } from "react";
import styles from "@/components/sponsor-card.module.css";

type Sponsor = { id: string; name: string; logoUrl: string };

function restoreLegacyLogo(image: HTMLImageElement) {
  if (image.naturalWidth !== 800 || image.naturalHeight !== 800) return null;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const offset = (y * canvas.width + x) * 4;
      const transparent = data[offset + 3] < 24;
      const white = data[offset] > 245 && data[offset + 1] > 245 && data[offset + 2] > 245;
      if (transparent || white) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right < left || bottom < top) return null;
  const padding = 2;
  left = Math.max(0, left - padding); top = Math.max(0, top - padding);
  right = Math.min(canvas.width - 1, right + padding); bottom = Math.min(canvas.height - 1, bottom + padding);
  const restored = document.createElement("canvas");
  restored.width = right - left + 1;
  restored.height = bottom - top + 1;
  const restoredContext = restored.getContext("2d");
  if (!restoredContext) return null;
  restoredContext.drawImage(canvas, left, top, restored.width, restored.height, 0, 0, restored.width, restored.height);
  return restored.toDataURL("image/png");
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [restoredLogo, setRestoredLogo] = useState<{ url: string; source: string } | null>(null);
  const displayedLogo = restoredLogo?.url === sponsor.logoUrl ? restoredLogo.source : sponsor.logoUrl;
  useEffect(() => {
    if (!sponsor.logoUrl) return;
    let active = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const restored = restoreLegacyLogo(image);
        if (active && restored) setRestoredLogo({ url: sponsor.logoUrl, source: restored });
      } catch {
        // Keep the original image if the legacy file cannot be read.
      }
    };
    image.src = sponsor.logoUrl;
    return () => { active = false; image.onload = null; };
  }, [sponsor.logoUrl]);
  return <div className={styles.card}>
    {sponsor.logoUrl ? <img className={styles.logo} src={displayedLogo} alt={`Logo von ${sponsor.name}`} /> : <span className={styles.name}>{sponsor.name}</span>}
  </div>;
}
