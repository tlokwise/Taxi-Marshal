const mapContainer = document.querySelector("#map");
const inputText = document.querySelector("#inputText");
const typeSelect = document.querySelector("#type-of-place");
const infoBox = document.querySelector(".info-box");
const reviewBtn = document.querySelector("#review-btn");
const submitBtn = document.querySelector("#submit-btn");
const viewInMapBtn = document.querySelector("#view-in-map-btn");
let reviewInfoObj;
let map;
var userCoords;

reviewBtn.addEventListener("click", () => {
  if (reviewInfoObj != undefined) updateReviewInfo();
  else alert("Insert address");
});

function initMap() {
  const mapCenter = { lat: -26.04873, lng: 28.15978 }; // South Africa coordinates (center)
  map = new google.maps.Map(document.querySelector("#map"), {
    center: mapCenter,
    zoom: 10,
    disableDefaultUI: true,
  });

  autcomplete = new google.maps.places.Autocomplete(inputText);
  autcomplete.setComponentRestrictions({ country: "za" });

  // Bias the results towards the current map's viewport
  autcomplete.bindTo("bounds", map);

  //event listener for when a place is selected
  autcomplete.addListener("place_changed", function () {
    const place = autcomplete.getPlace();

    console.log("Place Name: " + place.name);
    console.log("Place Address: " + place.formatted_address);
    console.log("Place ID: " + place.place_id);
    console.log("Location: " + place.geometry.location);

    reviewInfoObj = {
      name: place.name,
      address: place.formatted_address,
      placeId: place.place_id,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };

    map.setZoom(18);
    map.setCenter({
      lat: reviewInfoObj.latitude,
      lng: reviewInfoObj.longitude,
    });

    new google.maps.Marker({
      position: {
        lat: reviewInfoObj.latitude,
        lng: reviewInfoObj.longitude,
      },
      map: map,
    });

    updateReviewInfo();
  });
}

function updateReviewInfo() {
  infoBox.innerHTML = `
    <span class="row">
        <h4>Type</h4>
        <p>${typeSelect.value}</p>
    </span>
    <span class="row">
    <h4>Name</h4>
    <p>${reviewInfoObj.name}</p>
</span>
<span class="row">
    <h4>Address</h4>
    <p>
        ${reviewInfoObj.address}
    </p>
</span>
<span class="row">
    <h4>Place ID</h4>
    <p>${reviewInfoObj.placeId}</p>
</span>
<span class="row">
    <h4>Coordinates</h4>
    <p>lat: ${reviewInfoObj.latitude}, lng: ${reviewInfoObj.longitude}</p>
</span>

<span class="row">
    <button type="button" onClick="viewMap()" id="view-in-map-btn" class="btn btn-success">View in map</button>
</span>
<span class="row">
    <button type="button" onClick="submitQuery()" id="submit-btn" class="btn btn-primary">Submit</button>
</span>
`;
}

function viewMap() {
  mapContainer.style.display = "block";
}

function submitQuery() {
  let queryObj = {
    type: typeSelect.value,
    name: reviewInfoObj.name,
    address: reviewInfoObj.address,
    placeId: reviewInfoObj.placeId,
    latitude: reviewInfoObj.latitude,
    longitude: reviewInfoObj.longitude,
  };

  const dataToSend = JSON.stringify(queryObj);

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: dataToSend,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.affectedRows > 0) {
        alert("Operation was successful");
      } else {
        alert("Operation failed");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
