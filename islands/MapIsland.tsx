// deno-lint-ignore no-explicit-any
declare const L: any;

import { useEffect, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

type LocationData = {
  name: string;
  city: string;
  lat: number;
  lon: number;
};

type LocationAddedEventDetail = {
  lat: number;
  lon: number;
  name: string;
  city: string;
};

export default function MapIsland() {
  const mapRef = useRef(null); // Create a ref to store the map instance

  const initializeMap = async () => {
    mapRef.current = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    const response = await fetch("/api/get_locations");
    const data: LocationData[] = await response.json();

    data.forEach((location) => {
      L.marker([location.lat, location.lon]).addTo(mapRef.current)
        .bindPopup(`${location.name}, ${location.city}`)
        .openPopup();
    });
  };

  // Use an effect hook to initialize the map and set up the event listener
  useEffect(() => {
    if (IS_BROWSER) {
      initializeMap();

      const handleLocationAdded = (
        event: Event,
      ) => {
        const customEvent = event as CustomEvent<LocationAddedEventDetail>;
        const newData = customEvent.detail;
        if (mapRef.current) {
          L.marker([newData.lat, newData.lon]).addTo(mapRef.current)
            .bindPopup(`${newData.name}, ${newData.city}`)
            .openPopup();
        }
      };

      // Listen for the custom event from FormIsland
      (document as EventTarget).addEventListener(
        "locationAdded",
        handleLocationAdded,
      );

      // Clean up the event listener when the component unmounts
      return () => {
        (document as EventTarget).removeEventListener(
          "locationAdded",
          handleLocationAdded,
        );
      };
    }
  }, []); // The empty dependency array means this effect will only run once.

  return <div id="map" style={{ height: "500px" }}></div>;
}
