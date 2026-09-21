import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veranstaltungen | Schiteam Julbach",
  description: "Skikurse, Trainings und Vereinsveranstaltungen des Schiteam Julbach.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
