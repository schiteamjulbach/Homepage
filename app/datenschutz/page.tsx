import type { Metadata } from 'next';
import { database } from '@/lib/server-db';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Datenschutz | Schiteam Julbach',
  alternates: { canonical: `${SITE_URL}/datenschutz` },
};

export default async function PrivacyPage() {
  let privacy = '';
  try {
    const row = await database().prepare("SELECT value FROM settings WHERE key='legal'").first<{value:string}>();
    privacy = row ? JSON.parse(row.value).privacy || '' : '';
  } catch {
    privacy = 'Die Datenschutzerklärung konnte gerade nicht geladen werden. Bitte versuche es erneut.';
  }
  return <main className="form-page"><a href="/" className="back-link">Zurück zum Schiteam Julbach</a><h1>Datenschutzerklärung</h1><div className="legal-copy" style={{whiteSpace:'pre-wrap'}}>{privacy || 'Die Datenschutzerklärung wird derzeit ergänzt.'}</div></main>;
}
