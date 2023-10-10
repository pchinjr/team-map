// We are declaring the Leaflet library (L) as an ambient constant, which will be globally available.
// The exact types for this library might not be directly available or may be complex to define,
// so for simplicity and to ensure compatibility, we are using the 'any' type.
// The Deno linter typically discourages the use of 'any' due to the loss of type safety,
// but in this instance, we are consciously ignoring the lint warning.
// deno-lint-ignore no-explicit-any
declare const L: any;

import type { LatLngTuple } from "../types/leaflet.d.ts";
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
  const mapRef = useRef<L.Map | L.LayerGroup | null>(null); // Create a ref to store the map instance
  const markersRef = useRef<LatLngTuple[]>([]); // To store the coordinates of all the markers

  const initializeMap = async () => {
    mapRef.current = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    const response = await fetch("/api/get_locations");
    const data: LocationData[] = await response.json();

    data.forEach((location) => {
      // Before adding a marker, ensure that the map reference is valid and not null.
      // This check ensures type safety and avoids potential runtime errors.
      if (mapRef.current) {
        L.marker([location.lat, location.lon]).addTo(mapRef.current)
          .bindPopup(`${location.name}, ${location.city}`)
          .openPopup();
        markersRef.current.push([location.lat, location.lon]); // Push the coordinates to the markersRef array
      }
    });

    // Fit the map view to contain all markers.
    // Before calling the 'fitBounds' method, we first check if 'mapRef.current' exists and there are markers.
    // Then, we ensure 'fitBounds' exists on 'mapRef.current' (by treating it as an instance of L.Map)
    // before making the call. This provides a safety check against potential type issues.
    if (mapRef.current && markersRef.current.length) {
      if ((mapRef.current as L.Map).fitBounds) {
        (mapRef.current as L.Map).fitBounds(markersRef.current);
      }
    }
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
