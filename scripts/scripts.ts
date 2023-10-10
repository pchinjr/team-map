const args = Deno.args;

async function clearLocationsDb() {
  const kv = await Deno.openKv();

  const keysToDelete = [];
  for await (const record of kv.list({ prefix: ["locations"] })) {
    keysToDelete.push(record.key);
  }

  for (const key of keysToDelete) {
    await kv.delete(key);
  }

  console.log("Location data cleared from database!");
}

async function seedLocationsDb() {
  type LocationValue = {
    city: string;
    lat: number;
    lon: number;
  };

  const kv = await Deno.openKv();

  const location1: LocationValue = {
    city: "New York",
    lat: 40.7128,
    lon: -74.0060,
  };
  const location2: LocationValue = {
    city: "Los Angeles",
    lat: 34.0522,
    lon: -118.2437,
  };
  const location3: LocationValue = {
    city: "Chicago",
    lat: 41.8781,
    lon: -87.6298,
  };

  await kv.set(["locations", "John"], location1);
  await kv.set(["locations", "Emma"], location2);
  await kv.set(["locations", "Robert"], location3);

  console.log("Database seeded with example location data!");
}

// Execute the appropriate task based on the command-line argument
if (args[0] === "clear") {
  clearLocationsDb();
} else if (args[0] === "seed") {
  seedLocationsDb();
} else {
  console.log("Please specify a valid task: 'clear' or 'seed'");
}
