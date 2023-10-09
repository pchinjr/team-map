import MapIsland from "../islands/MapIsland.tsx";
import FormIsland from "../islands/FormIsland.tsx";

export default function HomePage() {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mapping App</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
      </head>
      <body>
        <MapIsland />
        <FormIsland />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      </body>
    </>
  );
}
