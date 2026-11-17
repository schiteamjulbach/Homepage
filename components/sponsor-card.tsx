"use client";

import { useState, type CSSProperties, type SyntheticEvent } from "react";
import styles from "@/components/sponsor-card.module.css";

type Sponsor = { id: string; name: string; logoUrl: string };

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [measurement, setMeasurement] = useState<{ url: string; ratio: number } | null>(null);
  const activeMeasurement = measurement?.url === sponsor.logoUrl ? measurement : null;
  const originalRatio = Math.max(0.8, Math.min(3.35, activeMeasurement?.ratio || 2));
  const cardWidth = Math.round(160 * originalRatio + 30);
  const style = { "--sponsor-card-width": `${cardWidth}px` } as CSSProperties;
  const measureOriginal = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (!image.naturalHeight) return;
    const ratio = image.naturalWidth / image.naturalHeight;
    setMeasurement({ url: sponsor.logoUrl, ratio });
  };
  return <div className={styles.card} style={style}>
    {sponsor.logoUrl ? <img className={styles.logo} src={sponsor.logoUrl} alt={`Logo von ${sponsor.name}`} onLoad={measureOriginal} /> : <span className={styles.name}>{sponsor.name}</span>}
  </div>;
}
