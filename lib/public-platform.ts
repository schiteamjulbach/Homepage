import { cache } from "react";
import { database } from "@/lib/server-db";
import { seed, eventList } from "@/lib/platform-data";
import type { PublicPlatform } from "@/components/public-site";

// Share the API's visibility, sorting and registration status rules.
export const getPublicPlatform = cache(async (): Promise<PublicPlatform> => {
  await seed();
  const db = database();
  const [events, legal, sponsors, board] = await Promise.all([
    eventList(),
    db.prepare("SELECT value FROM settings WHERE key='legal'").first<{ value: string }>(),
    db.prepare("SELECT value FROM settings WHERE key='sponsors'").first<{ value: string }>(),
    db.prepare("SELECT value FROM settings WHERE key='board'").first<{ value: string }>(),
  ]);
  return {
    events,
    legal: legal ? JSON.parse(legal.value) : { privacy: "", imprint: "" },
    sponsors: sponsors ? JSON.parse(sponsors.value) : [],
    board: board ? JSON.parse(board.value) : [],
  };
});
