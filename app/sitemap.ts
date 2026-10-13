import type { MetadataRoute } from "next";
import { getPublicPlatform } from "@/lib/public-platform";
import { SITE_URL, eventUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { events } = await getPublicPlatform();
  return [{ url: `${SITE_URL}/` }, ...events.map(event => ({ url: eventUrl(event.id) }))];
}
