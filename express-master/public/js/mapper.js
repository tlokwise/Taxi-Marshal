const container = document.querySelector(".container");
//mapper
window.onload = () => {
  fetch("/placemapper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      renderResults(data);
    });
};

function renderResults(data) {
  const location = data.location;
  const destination = data.destination;
  for (let k = 0; k < location.length; k++) {
    console.log(location[k]);
    console.log(destination[k]);

    container.innerHTML += `<div class="item">
    <span class="location-name">${location[k].location_name}</span>
    <span class="location-address">${location[k].address}</span>
    <span class="destination-name">${destination[k].destination_name}</span>
    <span class="destination-address">${destination[k].address}</span>
  </div>`;
  }
}
