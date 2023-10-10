// islands/FormIsland.tsx
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

// deno-lint-ignore no-explicit-any
declare const L: any;

export default function FormIsland() {
  // State to store feedback message
  const [feedback, setFeedback] = useState("");

  // When using client-only APIs, like EventSource or navigator.getUserMedia,
  // this component will not run on the server as it will produce an error
  if (!IS_BROWSER) {
    return (
      <div>
        <h2>Add your location</h2>
        <form id="location-form">
          <input type="text" id="name" placeholder="Enter your name" required />
          <input type="text" id="city" placeholder="Enter your city" required />
          <input
            type="text"
            id="country"
            placeholder="Enter your country"
            required
          />
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
      const country = (document.getElementById("country") as HTMLInputElement).value;

      fetch("/api/save_location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, city, country }),
      }).then(async (response) => {
          if(!response.ok) {
            const error=await response.json();
            throw new Error(error.message);
          }
          return response.json()
      }) 
        .then((data) => {
          if (data.status === "success") {
            // Ensure that the data structure being dispatched is correct
            const eventData = {
              detail: {
                name,
                city,
                country,
                lat: data.lat,
                lon: data.lon,
              },
            };
            document.dispatchEvent(
              new CustomEvent("locationAdded", eventData),
            );
          } else {
            setFeedback("Failed to add location. Please try again.");
          }
        }).catch((error) => {
          setFeedback(`An error occurred. Error: ${error.message}`);
        });
    });
  }

  return (
    <div>
      <h2>Add your location</h2>
      <form id="location-form">
        <input type="text" id="name" placeholder="Enter your name" required />
        <input type="text" id="city" placeholder="Enter your city" required />
        <input
          type="text"
          id="country"
          placeholder="Enter your country"
          required
        />
        <button type="submit">Add Location</button>
      </form>
      <p>{feedback}</p>
    </div>
  );
}
