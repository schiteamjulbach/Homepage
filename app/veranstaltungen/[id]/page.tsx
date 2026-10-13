import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/components/public-site";
import { getPublicPlatform } from "@/lib/public-platform";
import { ORGANIZATION_ID, SITE_URL, eventUrl, serializeJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

async function getEvent(params: Props["params"]) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const data = await getPublicPlatform();
  const event = data.events.find(item => item.id === Number(id));
  if (!event) notFound();
  return { data, event };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event } = await getEvent(params);
  const description = `${event.title} am ${event.dateLong} in ${event.place}. Informationen und Anmeldung beim Schiteam Julbach.`;
  return {
    title: `${event.title} | Schiteam Julbach`,
    description,
    alternates: { canonical: eventUrl(event.id) },
    openGraph: { title: event.title, description, url: eventUrl(event.id) },
  };
}

export default async function EventPage({ params }: Props) {
  const { data, event } = await getEvent(params);
  // starts/ends describe registration, not the date of the event.
  // Legacy events without an explicit event date receive no invented date.
  const jsonLd = event.eventStartDate ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl(event.id)}#event`,
    url: eventUrl(event.id),
    name: event.title,
    description: event.description,
    startDate: event.eventStartDate,
    ...(event.eventEndDate ? { endDate: event.eventEndDate } : {}),
    location: { "@type": "Place", name: event.place },
    image: new URL(event.imageUrl || "/schiteam-momente.jpeg", SITE_URL).href,
    organizer: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Schiteam Julbach", url: `${SITE_URL}/` },
  } : null;
  return <>
    {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
    <Home initialData={data} initialEventId={event.id} />
  </>;
}
