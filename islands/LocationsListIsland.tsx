import { useEffect, useState } from "preact/hooks";

type LocationData = {
  name: string;
  city: string;
  lat: number;
  lon: number;
};

export default function LocationsListIsland() {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    // Fetch the locations data from the API
    fetch("/api/get_locations")
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>City</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <tbody>
        {locations.map((location) => (
          <tr key={location.name}>
            <td>{location.name}</td>
            <td>{location.city}</td>
            <td>{location.lat.toFixed(4)}</td>
            <td>{location.lon.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
