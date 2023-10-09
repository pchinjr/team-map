// routes/api/save_location.ts

import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await req.json();
    const kv = await Deno.openKv();

    // For simplicity, we'll use a mock latitude and longitude.
    // In a real-world scenario, you'd fetch these from a geocoding service.
    const lat = Math.random() * 180 - 90; // Random latitude
    const lon = Math.random() * 360 - 180; // Random longitude

    const key = ["locations", body.name];
    await kv.set(key, { city: body.city, lat, lon });

    return new Response(JSON.stringify({ status: "success", lat, lon }), {
      headers: { "content-type": "application/json" },
    });
  },
};
