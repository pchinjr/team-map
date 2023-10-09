// routes/api/get_locations.ts
import { Handlers } from "$fresh/server.ts";

type LocationValue = {
  city: string;
  lat: number;
  lon: number;
};

export const handler: Handlers = {
  async GET(_req) {
    const kv = await Deno.openKv();
    const locations = [];
    for await (const rawEntry of kv.list({ prefix: ["locations"] })) {
      const entry = rawEntry as Deno.KvEntry<LocationValue>;
      locations.push({ name: entry.key[1], ...entry.value });
    }
    return new Response(JSON.stringify(locations), {
      headers: { "content-type": "application/json" },
    });
  },
};
