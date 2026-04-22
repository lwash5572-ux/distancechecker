function calculateDistance() {
  const from = document.getElementById("fromCity").value;
  const to = document.getElementById("toCity").value;

  if (!from || !to) {
    document.getElementById("result").innerText = "Please enter both cities.";
    return;
  }

  // Fake distance (replace with real API later)
  const distance = Math.floor(Math.random() * 3000) + 100;

  document.getElementById("result").innerText =
    `Distance from ${from} to ${to} is approximately ${distance} miles.`;
}