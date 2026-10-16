export const SITE_URL = "https://www.schiteam-julbach.at";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const SHARE_IMAGE = {
  url: `${SITE_URL}/schiteam-share-logo.png`,
  width: 1200,
  height: 630,
  alt: "Schiteam Union Julbach – schwarzes Logo auf weißem Hintergrund",
};

export function eventUrl(id: number) {
  return `${SITE_URL}/veranstaltungen/${id}`;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Schiteam Julbach",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/schiteam-logo.png`,
  email: "schiteam.julbach@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Julbach",
    postalCode: "4162",
    addressRegion: "Oberösterreich",
    addressCountry: "AT",
  },
};
