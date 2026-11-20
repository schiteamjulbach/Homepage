import type { Metadata } from "next";
import "./globals.css";
import { SHARE_IMAGE, SITE_URL, organizationJsonLd, serializeJsonLd } from "@/lib/seo";
import { getPublicPlatform } from "@/lib/public-platform";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Veranstaltungen | Schiteam Julbach",
  description: "Entdecke Skikurse, Trainings und Vereinsveranstaltungen des Schiteam Julbach. Alle Termine, Informationen und die Online-Anmeldung auf einen Blick.",
  alternates: { canonical: `${SITE_URL}/` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: "Schiteam Julbach",
    title: "Veranstaltungen | Schiteam Julbach",
    description: "Skikurse, Trainings und Vereinsveranstaltungen des Schiteam Julbach.",
    url: `${SITE_URL}/`,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veranstaltungen | Schiteam Julbach",
    description: "Skikurse, Trainings und Vereinsveranstaltungen des Schiteam Julbach.",
    images: [SHARE_IMAGE],
  },
  icons: {
    icon: "/favicon.svg?v=schiteam-black-20261013",
    shortcut: "/favicon.svg?v=schiteam-black-20261013",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { contact } = await getPublicPlatform();
  const organization = {
    ...organizationJsonLd,
    email: contact.email,
    address: {
      ...organizationJsonLd.address,
      streetAddress: contact.street || undefined,
      addressLocality: contact.city,
      postalCode: contact.postalCode,
      addressRegion: contact.region,
    },
  };
  return (
    <html lang="de">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }} />
        {children}
      </body>
    </html>
  );
}
