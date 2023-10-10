import MapIsland from "../islands/MapIsland.tsx";
import FormIsland from "../islands/FormIsland.tsx";
import LocationsListIsland from "../islands/LocationsListIsland.tsx";

export default function HomePage() {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fresh Team Map</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        >
        </script>
      </head>
      <body>
        <MapIsland />
        <FormIsland />
        <LocationsListIsland />
      </body>
    </>
  );
}
