import styles from "@/components/sponsor-card.module.css";

type Sponsor = { id: string; name: string; logoUrl: string };

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return <div className={styles.card}>
    {sponsor.logoUrl ? <img className={styles.logo} src={sponsor.logoUrl} alt={`Logo von ${sponsor.name}`} /> : <span className={styles.name}>{sponsor.name}</span>}
  </div>;
}
