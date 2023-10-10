// routes/api/save_location.ts

import { Handlers } from "$fresh/server.ts";

async function getGeolocation(city: string, country: string) {
  const endpoint = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`;
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new Error("Failed to fetch geolocation data.");
  }

  const [data] = await response.json();

  if (!data) {
    return null;
  }

  return {
    lat: parseFloat(data.lat),
    lon: parseFloat(data.lon)
  };
}

export const handler: Handlers = {
  async POST(req) {
    const { name, city, country } = await req.json();
    const location = await getGeolocation(city, country);
    // Check if location data is valid
    if (!location || !location.lat || !location.lon) {
      return new Response(
        JSON.stringify({ status: "error", message: "Invalid location data. Please ensure you've provided a valid city and country." }),
        { headers: { "content-type": "application/json" }, status: 400 }
      );
    }
    const lat = location.lat;
    const lon = location.lon;

    const kv = await Deno.openKv();
    await kv.set(["locations", name], { city, country, lat, lon });

    return new Response(JSON.stringify({ status: "success", lat, lon }), {
      headers: { "content-type": "application/json" },
    });
  },
};
