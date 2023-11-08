let mapContainer = document.querySelector("#map");
let placeTypeAutocomplete = document.querySelector("#place-type-select");
let userLocationInputAutocomplete = document.querySelector("#user-location");
let infoDistanceFromUser = document.querySelectorAll(
  ".info-distance-from-user"
);
let distanceFromUser;
let userLocationObject;
let getDataAutocompleteResults;
let map;
function initSearchMap() {
  //   const mapCenter = { lat: -26.04873, lng: 28.15978 }; // South Africa coordinates (center)

  map = new google.maps.Map(mapContainer, null);

  //FROM AUTO COMPLETE
  const locationAutocomplete = new google.maps.places.Autocomplete(
    userLocationInputAutocomplete
  );

  // Restrict the search to a specific region
  // restrict to the south africa
  locationAutocomplete.setComponentRestrictions({ country: "za" });

  //event listener for when a place is selected
  locationAutocomplete.addListener("place_changed", function () {
    

    const place = locationAutocomplete.getPlace();
    console.log("Place Name: " + place.name);
    console.log("Place Address: " + place.formatted_address);
    console.log("Place ID: " + place.place_id);
    console.log("Location: " + place.geometry.location);

    userLocationObject = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };
  });
}

function getData() {
  fetch("/database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ placeType: placeTypeAutocomplete.value }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      getDataAutocompleteResults = data;
      console.log(getDataAutocompleteResults.location);
      return data;
    });
}

function calculateDistanceFromUser(userLat, userLng, toLat, toLng) {
  userLat = toRadians(userLat);
  userLng = toRadians(userLng);
  toLat = toRadians(toLat);
  toLng = toRadians(toLng);

  let latDifference = toLat - userLat;
  let lngDifference = toLng - userLng;

  let a =
    Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
    Math.cos(userLat) *
      Math.cos(toLat) *
      Math.sin(lngDifference / 2) *
      Math.sin(lngDifference / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let earthRadius = 6371;

  let distanceFromUser = earthRadius * c;

  return Math.round(distanceFromUser);
}

function toRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}
