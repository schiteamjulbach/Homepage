"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "@/components/sponsor-card.module.css";

type Sponsor = { id: string; name: string; logoUrl: string };

// Uploaded logos may include white or transparent margins inside the image.
// Measure the visible logo so card proportions do not depend on that padding.
function visibleLogo(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const offset = (y * canvas.width + x) * 4;
      if (data[offset + 3] < 24 || (data[offset] > 245 && data[offset + 1] > 245 && data[offset + 2] > 245)) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right < left || bottom < top) return null;
  left = Math.max(0, left - 3); top = Math.max(0, top - 3);
  right = Math.min(canvas.width - 1, right + 3); bottom = Math.min(canvas.height - 1, bottom + 3);
  const cropped = document.createElement("canvas");
  cropped.width = right - left + 1; cropped.height = bottom - top + 1;
  const croppedContext = cropped.getContext("2d");
  if (!croppedContext) return null;
  croppedContext.drawImage(canvas, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  return { source: cropped.toDataURL("image/png"), ratio: cropped.width / cropped.height };
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [logo, setLogo] = useState<{ url: string; source: string; ratio: number } | null>(null);
  useEffect(() => {
    let active = true;
    if (!sponsor.logoUrl) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const result = visibleLogo(image);
        if (active && result) setLogo({ url: sponsor.logoUrl, ...result });
      } catch {
        // External images without canvas access retain their original display.
      }
    };
    image.src = sponsor.logoUrl;
    return () => { active = false; image.onload = null; };
  }, [sponsor.logoUrl]);
  const activeLogo = logo?.url === sponsor.logoUrl ? logo : null;
  const visibleRatio = Math.max(0.8, Math.min(3.35, activeLogo?.ratio || 2));
  const cardWidth = Math.round(160 * visibleRatio + 30);
  const style = { "--sponsor-card-width": `${cardWidth}px` } as CSSProperties;
  return <div className={styles.card} style={style}>
    {sponsor.logoUrl ? <img className={styles.logo} src={activeLogo?.source || sponsor.logoUrl} alt={`Logo von ${sponsor.name}`} /> : <span className={styles.name}>{sponsor.name}</span>}
  </div>;
}
