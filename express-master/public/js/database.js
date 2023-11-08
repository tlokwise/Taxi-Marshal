let placeType = document.querySelector(".place-type-select");
let searchBox = document.querySelector("#search-box");
let infoSection = document.querySelector(".info-section");
let returnedData;
placeType.addEventListener("change", () => {
  getData();
});
window.addEventListener("load", () => {
  getData();
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
      infoSection.innerHTML = "";
      data.forEach((dataItem) => {
        if (placeType.value == "locations") {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name
          );
        } else {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.destination_name
          );
        }
      });
    });
}

searchBox.addEventListener("input", () => {
  //   if (!searchBox.value == "") {
  infoSection.innerHTML = "";
  if (returnedData != undefined) {
    returnedData.forEach((dataItem) => {
      if (placeType.value == "locations") {
        if (dataItem.location_name.toLowerCase().includes(searchBox.value)) {
          //dynamically adjusting the list
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name
          );
        }
      }

      if (placeType.value == "destinations") {
        if (dataItem.destination_name.toLowerCase().includes(searchBox.value)) {
          //dynamically adjusting the list
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.destination_name
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
            dataItem.destination_name
          );
        });
      }
      if (placeType.value == "locations") {
        returnedData.forEach((dataItem) => {
          renderResults(
            dataItem.address,
            dataItem.place_id,
            dataItem.location_name
          );
        });
      }
    }
  }

  let infoSectionContainer = document.querySelectorAll("section");
});

function renderResults(resultsAddress, resultsPlaceId, resultsName) {
  let sectionContent = `
  <section>
      <span class="rank-name">${resultsName}</span>
      <span class="rank-address">${resultsAddress}</span>
      <span class="place-id">${resultsPlaceId}</span>
      </section>
      `;
  infoSection.innerHTML += sectionContent;

  let infoSectionContainer = document.querySelectorAll("section");
  //on item selected
  infoSectionContainer.forEach((section) => {
    section.addEventListener("click", () => {
      let placeIdSpan = section.childNodes[5].textContent;
      let rankAddressSpan = section.childNodes[3].textContent;
      let rankNameSpan = section.childNodes[1].textContent;

      //
      infoSection.innerHTML = `<div class="selectedSection">
      <div class="controls">
        <button class="close-selected" onClick="onCloseSelected()">Close</button>
      </div>
        <div class="selected-section-name">${rankNameSpan}</div>
        <div class="selected-section-name">${rankAddressSpan}</div>
        <div class="selected-section-place-id">${placeIdSpan}</div>
      <div class="controls">
          <button class="add">Add</button>
      </div>
  </div>`;
    });
  });
}
function onCloseSelected(resultsAddress, resultsPlaceId, resultsName) {
  location.reload();
}

function onAdd(rankName, rankAddress, rankPlaceId) {
  infoSection.innerHTML = "";

  infoSection.innerHTML = `<div class="selectedSection">
      <div class="controls">
        <button class="close-selected" onClick="onCloseSelected()">Close</button>
      </div>
        <div class="selected-section-name">${rankName}</div>
        <div class="selected-section-name">${rankAddress}</div>
        <div class="selected-section-place-id">${rankPlaceId}</div>`;
}
