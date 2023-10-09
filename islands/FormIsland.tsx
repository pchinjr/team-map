// islands/FormIsland.tsx
import { IS_BROWSER } from "$fresh/runtime.ts";

// deno-lint-ignore no-explicit-any
declare const L: any;

export default function FormIsland() {
  if (!IS_BROWSER) {
    return (
      <div>
        <h2>Add your location</h2>
        <form id="location-form">
          <input type="text" id="name" placeholder="Enter your name" required />
          <input type="text" id="city" placeholder="Enter your city" required />
          <button type="submit">Add Location</button>
        </form>
      </div>
    );
  }

  // Handle form submission logic here
  const formElement = document.getElementById("location-form");
  if (formElement) {
    formElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const city = (document.getElementById("city") as HTMLInputElement).value;

      fetch("/api/save_location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, city }),
      }).then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            // Ensure that the data structure being dispatched is correct
            const eventData = {
              detail: {
                name,
                city,
                lat: data.lat,
                lon: data.lon,
              },
            };
            document.dispatchEvent(
              new CustomEvent("locationAdded", eventData),
            );
          } else {
            alert("Failed to add location.");
          }
        });
    });
  }

  return (
    <div>
      <h2>Add your location</h2>
      <form id="location-form">
        <input type="text" id="name" placeholder="Enter your name" required />
        <input type="text" id="city" placeholder="Enter your city" required />
        <button type="submit">Add Location</button>
      </form>
    </div>
  );
}
