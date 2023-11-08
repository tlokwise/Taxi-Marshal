const apiKey = "AIzaSyC_xPz1x1gIoH33Cq-Yat-j-tQvpZI5B_A";
let userCoords;
let placeType = document.querySelector("#place-type-select");
let searchBox = document.querySelector("#info-search");
let infoContainer = document.querySelector(".info-container");
let userLocationInput = document.querySelector("#user-location");
let getUserLocationBtn = document.querySelector(".get-user-location-btn");
let returnedData;
placeType.addEventListener("change", () => {
  getData();
});
window.addEventListener("load", () => {
  getData();
});
getUserLocationBtn.addEventListener("click", () => {
  getUserLiveLocation();
});

function getData() {
  fetch("/database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ placeType: placeType.value }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      returnedData = data;
      infoContainer.innerHTML = "";
      data.forEach((dataItem) => {
        if (placeType.value == "locations") {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name,
            dataItem.latitude,
            dataItem.longitude
          );
        } else {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.destination_name,
            dataItem.latitude,
            dataItem.longitude
          );
        }
      });
    });
}

searchBox.addEventListener("input", onSearchInputChange);

function onSearchInputChange() {
  //   if (!searchBox.value == "") {
  infoContainer.innerHTML = "";
  if (returnedData != undefined) {
    returnedData.forEach((dataItem) => {
      if (placeType.value == "locations") {
        if (
          dataItem.location_name
            .toLowerCase()
            .includes(searchBox.value.toLowerCase())
        ) {
          //dynamically adjusting the list
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name,
            dataItem.latitude,
            dataItem.longitude
          );
        }
      }

      if (placeType.value == "destinations") {
        if (
          dataItem.destination_name
            .toLowerCase()
            .includes(searchBox.value.toLowerCase())
        ) {
          //dynamically adjusting the list
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.destination_name,
            dataItem.latitude,
            dataItem.longitude
          );
        }
      }
    });
  }
  //   }
  if (searchBox.value == "") {
    if (returnedData != undefined) {
      if (placeType.value == "destinations") {
        returnedData.forEach((dataItem) => {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.destination_name,
            dataItem.latitude,
            dataItem.longitude
          );
        });
      }
      if (placeType.value == "locations") {
        returnedData.forEach((dataItem) => {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name,
            dataItem.latitude,
            dataItem.longitude
          );
        });
      }
    }
  }
}

function renderResults(
  resultsAdress,
  resultsPlaceId,
  resultsName,
  resultsLatitude,
  resultsLongitude
) {
  let infoItemContent = `
  <div class="info-item">
    <span class="info-name">${resultsName}</span>
    <span class="info-address">${resultsAdress}</span>
    <span class="place-id">${resultsPlaceId}</span>
    <span class="info-distance-from-user"></span>
    
  </div>
  `;
  infoContainer.innerHTML += infoItemContent;
  let distanceFromUser = document.querySelectorAll(".info-distance-from-user");
  //
  distanceFromUser.forEach((distance) => {
    if (userCoords != undefined) {
      distance.innerHTML =
        calculateDistanceFromUser(
          userCoords.lat,
          userCoords.lng,
          resultsLatitude,
          resultsLongitude
        ) + "km away";
    } else {
      distance.innerHTML = "";
    }
  });

  let allInfoItems = document.querySelectorAll(".info-item");
  allInfoItems.forEach((infoItem) => {
    infoItem.addEventListener("click", () => {
      infoContainer.innerHTML = "";

      let infoItemPlaceId = infoItem.childNodes[5].textContent;
      console.log(infoItemPlaceId);
      getRelated(infoItemPlaceId);
    });
  });
}

//
function getRelated(placeId) {
  let dataToSend = {
    placeId: placeId,
    type: placeType.value,
  };

  fetch("/related", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      const relatedData = data.results;
      console.log(data);
      infoContainer.innerHTML = `
      <span class="controlers">
      <button class="selected-close" onClick="onSelectedClose()">
      <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
      </button>
    </span>
      `;
      for (let i = 0; i < relatedData.length; i++) {
        if (placeType.value == "locations") {
          infoName = relatedData[i].destination_name;
        }
        if (placeType.value == "destinations") {
          infoName = relatedData[i].location_name;
        }
        infoContainer.innerHTML += `
        <div class="info-item">
          <span class="info-name">${infoName}</span>
          <span class="info-address">${relatedData[i].address}</span>
          <span class="place-id">${relatedData[i].place_id}</span>
          <span class="info-distance-from-user"></span>
          <span class="selected-price">R${data.prices[i]}</span>
          <span class="controlers">
            <button class="selected-close" onClick="onSelectedClose()">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
        </span>
        </div>
        `;
      }
    });
}

//
function onSelectedClose() {
  location.reload();
}
//
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

function onSelectedClose() {
  location.reload();
}

function getUserLiveLocation() {
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
              userLocationInput.value = data.results[0].formatted_address;
              console.log(data.results[0].formatted_address);
              // return data;
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
            alert(
              "PERMISSION DENIED : \n1. TURN ON YOUR LOCATION \n2. ALLOW ACCESS"
            );
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
