import { notFound } from "next/navigation";
import { DesignPreview } from "@/components/design-preview";
import { getPublicPlatform } from "@/lib/public-platform";
import { initialEvents } from "@/lib/initial-events";
import type { EventItem, PublicPlatform } from "@/components/public-site";

const previewSponsors = [
  { id: "preview-schiteam", name: "Schiteam Julbach", logoUrl: "https://www.schiteam-julbach.at/api/images?key=f4fcae64-fb50-4be2-b38f-4982d680e308" },
  { id: "preview-haarwerkstatt", name: "Haarwerkstatt Ulrichsberg", logoUrl: "https://www.schiteam-julbach.at/api/images?key=7bfbbe18-81e0-4625-8dd3-e45684c19a3c" },
  { id: "preview-kame", name: "KAME Engineering (Ingenieurbüro für Sondermaschinen- & Anlagenbau)", logoUrl: "https://www.schiteam-julbach.at/api/images?key=9a873401-166b-4723-af7f-5a4e427a003f" },
];

const variants = ["pistenstart", "naechster-termin", "verein-im-schnee", "premium-hero", "premium-startseite-hell", "premium-sponsoren", "premium-ueber-uns", "premium-termin", "premium-termin-hell", "premium-anmeldung", "premium-anmeldung-hell", "premium-admin", "premium-admin-hell"] as const;
type Variant = (typeof variants)[number];

export function generateStaticParams() {
  return variants.map((variant) => ({ variant }));
}
export default async function DesignPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ variant: string }>;
  searchParams: Promise<{ event?: string }>;
}) {
  const { variant } = await params;
  const { event: eventParam } = await searchParams;
  if (!variants.includes(variant as Variant)) notFound();
  let data: PublicPlatform;
  try {
    data = await getPublicPlatform();
  } catch {
    try {
      const response = await fetch("https://www.schiteam-julbach.at/api/platform", { cache: "no-store" });
      if (!response.ok) throw new Error("Live-Daten nicht verfügbar");
      data = await response.json() as PublicPlatform;
    } catch {
      data = {
        events: initialEvents.map((event) => ({ ...event, imagePosition: "50% 50%" }) as EventItem),
        sponsors: [],
        board: [],
        legal: { privacy: "", imprint: "" },
        contact: { email: "schiteam.julbach@gmail.com", street: "", postalCode: "4162", city: "Julbach", region: "Oberösterreich" },
      };
    }
  }
  const selectedEventId = Number(eventParam);
  if (!data.sponsors.length) data = { ...data, sponsors: previewSponsors };
  if ((variant === "premium-termin" || variant === "premium-termin-hell" || variant === "premium-anmeldung" || variant === "premium-anmeldung-hell") && Number.isInteger(selectedEventId)) {
    const selectedEvent = data.events.find((event) => event.id === selectedEventId);
    if (selectedEvent) data = { ...data, events: [selectedEvent, ...data.events.filter((event) => event.id !== selectedEventId)] };
  }
  return <DesignPreview variant={variant as Variant} data={data} />;
}

