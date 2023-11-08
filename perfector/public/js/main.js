const apiKey = "AIzaSyC_xPz1x1gIoH33Cq-Yat-j-tQvpZI5B_A";
let errorMsg = document.querySelector(".error-msg");
let mapWrapper = document.querySelector("#map-wrapper");
let getUserLocatinBtn = document.querySelector(".get-user-location-btn");
let submitBtn = document.querySelector("#submit-btn");
let refactorBtn = document.querySelector(".refactor-btn");
let closeMapBtn = document.querySelector("#close-map-btn");
let directionsBtn = document.querySelector(".directions-btn");
let locationInput = document.querySelector("#location-input");
let destinationInput = document.querySelector("#destination-input");
let infoContainer = document.querySelector(".info-container");
let infoLocationName = document.querySelector(".info-location-name");
let infoDestinationName = document.querySelector(".info-destination-name");
let infoYourStop = document.querySelector(".info-your-stop");
let infoPrice = document.querySelector(".info-price");
let map;
let userLocation; //user live location in address format
let userCoords; //user live location coordinates
let locationObject;
let destinationObject;
let closestLocationCoordinates;

//
getUserLocatinBtn.addEventListener("click", getUserLocation);
directionsBtn.addEventListener("click", onDirections);
closeMapBtn.addEventListener("click", oncloseMap);
refactorBtn.addEventListener("click", onRefactor);
window.addEventListener("load", getUserLocation);
function initMap() {
  const mapCenter = { lat: -26.04873, lng: 28.15978 }; // South Africa coordinates (center)

  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 15,
    disableDefaultUI: true, // Disable all default UI controls
  });

  //FROM AUTO COMPLETE
  const locationAutocomplete = new google.maps.places.Autocomplete(
    locationInput
  );

  // Restrict the search to a specific region
  // restrict to the south africa
  locationAutocomplete.setComponentRestrictions({ country: "za" });

  // Bias the results towards the current map's viewport
  locationAutocomplete.bindTo("bounds", map);

  //event listener for when a place is selected
  locationAutocomplete.addListener("place_changed", function () {
    const place = locationAutocomplete.getPlace();

    console.log("Place Name: " + place.name);
    console.log("Place Address: " + place.formatted_address);
    console.log("Place ID: " + place.place_id);
    console.log("Location: " + place.geometry.location);

    locationObject = {
      name: place.name,
      address: place.formatted_address,
      placeId: place.place_id,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };
  });

  //TO AUTO COMPLETE
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput
  );

  // Restrict the search to a specific region
  // restrict to the south africa
  destinationAutocomplete.setComponentRestrictions({ country: "za" });

  // Bias the results towards the current map's viewport
  destinationAutocomplete.bindTo("bounds", map);

  // Add an event listener for when a place is selected
  destinationAutocomplete.addListener("place_changed", function () {
    const place = destinationAutocomplete.getPlace();

    console.log("Place Name: " + place.name);
    console.log("Place Address: " + place.formatted_address);
    console.log("Place ID: " + place.place_id);
    console.log("Location: " + place.geometry.location);

    destinationObject = {
      name: place.name,
      address: place.formatted_address,
      placeId: place.place_id,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };
  });
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    location: locationObject,
    destination: destinationObject,
  };

  if (locationObject == undefined) {
    errorMsg.textContent = "Location is not defined";
    return;
  } else if (destinationObject == undefined) {
    errorMsg.textContent = "Destination is not defined";
    return;
  }
  errorMsg.textContent = "";

  const dataToSend = JSON.stringify(data);

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
    .then((responseData) => {
      processReponse(responseData);
      // console.log(responseData);
    })
    .catch((error) => {
      console.error(error);
    });
});

function processReponse(responseData) {
  let responseLocation = responseData.location;
  let responseDestination = responseData.destination;
  let responsePrice = responseData.price;

  infoLocationName.textContent = responseLocation.location_name;
  infoDestinationName.textContent = destinationObject.name;
  infoYourStop.textContent = responseDestination.name;
  infoPrice.textContent = "R" + responsePrice;

  closestLocationCoordinates = {
    latitude: responseLocation.latitude,
    longitude: responseLocation.longitude,
  };
}

//
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      //ON SUCCESS
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        userCoords = { lat: latitude, lng: longitude };
        //CONVERT COORDINATES INTO ADDRESS
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userCoords.lat},${userCoords.lng}&key=${apiKey}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.status == "OK") {
              userCoords = data.results[0].geometry.location;

              locationObject = {
                name: "",
                address: data.results[0].formatted_address,
                placeId: data.results[0].place_id,
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
              };
              locationInput.value = locationObject.address;
              console.log("Live location accessed");
            } else {
              console.log("Geocoding failed with status " + data.status);
            }
          })
          .catch((error) => {
            console.log("Error: " + error);
          });
      },
      //ON ERROR
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("PERMISSION DENIED");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("LOCATION UNAVAILABLE");
            break;
          case error.TIMEOUT:
            alert("TIMEOUT");
            break;
          default:
            alert("AN ERROR OCCURED");
            break;
        }
      },
      { enableHighAccuracy: true }
    );
  }
}

//on Directionss
function onDirections() {
  if (locationObject != undefined) {
    mapWrapper.style.display = "block";
    let userLocationLatLng = new google.maps.LatLng(
      locationObject.latitude,
      locationObject.longitude
    );
    let userLiveLocationMarker = new google.maps.Marker({
      position: userLocationLatLng,
      title: "Your Location",
    });

    userLiveLocationMarker.setMap(map);
    map.setCenter(userLocationLatLng);
    map.setZoom(16);
    if (closestLocationCoordinates != undefined) {
      const directionsService = new google.maps.DirectionsService();

      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
      });

      const request = {
        origin: { lat: locationObject.latitude, lng: locationObject.longitude },
        destination: {
          lat: closestLocationCoordinates.latitude,
          lng: closestLocationCoordinates.longitude,
        },
        travelMode: google.maps.TravelMode.WALKING,
      };

      // directionsRenderer.setMap(null);
      directionsService.route(request, (results, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(results);
        } else {
          alert("Directions request failed : " + status);
        }
      });
    }
    console.log("using inputted location");
    return;
  } else {
    //show map when no location is set
    mapWrapper.style.display = "block";
    console.log("no location provided");
  }
  if (userCoords != undefined) {
    //show map when location is permitted
    mapWrapper.style.display = "block";
    let userCoordsLatLng = new google.maps.LatLng(
      userCoords.lat,
      userCoords.lng
    );

    console.log(userCoords);

    let userLiveLocationMarker = new google.maps.Marker({
      position: userCoordsLatLng,
      title: "Your Location",
    });

    userLiveLocationMarker.setMap(map);
    map.setCenter(userCoordsLatLng);
    map.setZoom(16);
    if (closestLocationCoordinates != undefined) {
      const directionsService = new google.maps.DirectionsService();

      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
      });

      const request = {
        origin: { lat: userCoords.latitude, lng: userCoords.longitude },
        destination: {
          lat: closestLocationCoordinates.lat,
          lng: closestLocationCoordinates.lng,
        },
        travelMode: google.maps.TravelMode.WALKING,
      };

      // directionsRenderer.setMap(null);
      directionsService.route(request, (results, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(results);
        } else {
          alert("Directions request failed : " + status);
        }
      });
    }
    console.log("using geolocation");
    return;
  }
}

function onRefactor() {
  location.reload();
}

function oncloseMap() {
  mapWrapper.style.display = "none";
}
