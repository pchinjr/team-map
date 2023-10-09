// deno-lint-ignore no-explicit-any
declare const L: any;

import { useEffect } from 'preact/hooks';
import { IS_BROWSER } from "$fresh/runtime.ts";

type LocationData = {
  name: string;
  city: string;
  lat: number;
  lon: number;
};

export default function MapIsland() {
    const initializeMap = async () => {
        const map = L.map("map").setView([51.505, -0.09], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        const response = await fetch("/api/get_locations");
        const data: LocationData[] = await response.json();

        data.forEach((location) => {
            L.marker([location.lat, location.lon]).addTo(map)
            .bindPopup(`${location.name}, ${location.city}`)
            .openPopup();
        });
        };

        // Use an effect hook to initialize the map after the component has been attached to the DOM
        useEffect(() => {
        if (IS_BROWSER) {
            initializeMap();
        }
        }, []); // The empty dependency array means this effect will only run once, similar to componentDidMount in class components.

        return <div id="map" style={{ height: "500px" }}></div>;
}
