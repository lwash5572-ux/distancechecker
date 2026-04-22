let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.5, lng: -98.35 },
    zoom: 4,
  });

  const input1 = document.getElementById("fromCity");
  const input2 = document.getElementById("toCity");

  new google.maps.places.Autocomplete(input1);
  new google.maps.places.Autocomplete(input2);
}

window.onload = initMap;

function swapCities() {
  const from = document.getElementById("fromCity");
  const to = document.getElementById("toCity");

  const temp = from.value;
  from.value = to.value;
  to.value = temp;
}

function calculateDistance() {
  const from = document.getElementById("fromCity").value;
  const to = document.getElementById("toCity").value;

  if (!from || !to) {
    document.getElementById("result").innerText = "Enter both locations.";
    return;
  }

  const service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
    {
      origins: [from],
      destinations: [to],
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    },
    (response, status) => {
      if (status !== "OK") {
        document.getElementById("result").innerText = "Error calculating distance.";
        return;
      }

      const result = response.rows[0].elements[0];

      if (result.status === "ZERO_RESULTS") {
        document.getElementById("result").innerText = "No route found.";
        return;
      }

      let output = `Driving Distance: ${result.distance.text} | Time: ${result.duration.text}`;

      document.getElementById("result").innerText = output;

      calculateAirDistance(from, to);
    }
  );
}

// Airline distance
function getLatLng(place, callback) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: place }, (results, status) => {
    if (status === "OK") {
      callback(results[0].geometry.location);
    }
  });
}

function calculateAirDistance(from, to) {
  getLatLng(from, (loc1) => {
    getLatLng(to, (loc2) => {

      const R = 3958.8;
      const dLat = (loc2.lat() - loc1.lat()) * Math.PI / 180;
      const dLon = (loc2.lng() - loc1.lng()) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.lat() * Math.PI / 180) *
        Math.cos(loc2.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      document.getElementById("result").innerText +=
        ` | Air Distance: ${distance.toFixed(1)} miles`;
    });
  });
}