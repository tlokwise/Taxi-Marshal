const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;

//db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "wise",
  password: "Wiseman@300",
  database: "taximarshal",
});
db.connect((error) => {
  if (error) {
    console.log("Error connectin to MySQL\n" + error);
  } else {
    console.log("Connected to MySQL");
  }
});

//STATIC FILES
app.use(express.static(__dirname + "/public"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/css", express.static(__dirname + "public/css"));
app.use(express.json());
//VIEWS
app.set("views", "./views");
app.set("view engine", "ejs");

//ROUTES
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/library", (req, res) => {
  res.render("library");
});
app.get("/contribute", (req, res) => {
  res.render("contribute");
});

//
app.post("/submit", async (req, res) => {
  const { location, destination } = req.body;
  let closestDestinationObj;
  let closestLocationObj;
  const findDestination = async () => {
    const query = `SELECT * FROM destinations WHERE place_id = "${destination.placeId}"`;
    const queryResults = await executeDatabaseQuery(query);

    return queryResults;
  };

  const destinationExists = await findDestination();
  //if destination exist in database
  if (destinationExists.length > 0) {
    const findDestinationEntries = async () => {
      const query = `SELECT * FROM main_man WHERE destination_id = "${destination.placeId}"`;
      const entriesResults = await executeDatabaseQuery(query);

      return entriesResults;
    };

    const destinationEntries = await findDestinationEntries();
    //iterate through them to find their names
    let closestLocationDistance = Number.MAX_VALUE;

    for (let i = 0; i < destinationEntries.length; i++) {
      const entryLocationId = destinationEntries[i].location_id;

      const findLocationEntryName = async () => {
        const query = `SELECT * FROM locations WHERE place_id = "${entryLocationId}"`;
        const locationEntryName = await executeDatabaseQuery(query);

        return locationEntryName;
      };

      const locationNames = await findLocationEntryName();
      //FIND WHICH PLACES IS CLOSEST TO USER
      for (let k = 0; k < locationNames.length; k++) {
        let relativeDistance = calculateDistance(
          location.latitude,
          location.longitude,
          locationNames[k].latitude,
          locationNames[k].longitude
        );

        if (relativeDistance < closestLocationDistance) {
          closestLocationDistance = relativeDistance;

          closestLocationObj = {
            location_name: locationNames[k].location_name,
            address: locationNames[k].address,
            placeId: locationNames[k].place_id,
            latitude: locationNames[k].latitude,
            longitude: locationNames[k].longitude,
          };
        }
      }
    }

    //find the price
    const getPrice = async () => {
      const query = `SELECT * FROM main_man WHERE location_id = "${closestLocationObj.placeId}" AND destination_id = "${destination.placeId}"`;

      const getPriceResults = await executeDatabaseQuery(query);

      return getPriceResults;
    };

    const farePrice = await getPrice();

    res.json({
      location: closestLocationObj,
      destination: destination,
      price: farePrice[0].price,
    });
  } else {
    //if destination does not exist in database
    const getAllDestinations = async () => {
      const query = `SELECT * FROM destinations`;

      const queryResults = await executeDatabaseQuery(query);

      return queryResults;
    };

    const allDestinations = await getAllDestinations();

    //iterate through all destinations
    let closestDestinationDistance = Number.MAX_VALUE;
    for (let j = 0; j < allDestinations.length; j++) {
      const relativeDistance = calculateDistance(
        destination.latitude,
        destination.longitude,
        allDestinations[j].latitude,
        allDestinations[j].longitude
      );

      if (relativeDistance < closestDestinationDistance) {
        closestDestinationDistance = relativeDistance;

        closestDestinationObj = {
          name: allDestinations[j].destination_name,
          address: allDestinations[j].address,
          placeId: allDestinations[j].place_id,
          latitude: allDestinations[j].latitude,
          longitude: allDestinations[j].longitude,
        };
      }
    }

    const getAllLocations = async () => {
      const query = `SELECT * FROM main_man WHERE destination_id = "${closestDestinationObj.placeId}"`;

      const queryResults = await executeDatabaseQuery(query);
      return queryResults;
    };

    const allLocations = await getAllLocations();
    let closestLocationDistance = Number.MAX_VALUE;
    for (let z = 0; z < allLocations.length; z++) {
      const getLocationName = async () => {
        const query = `SELECT * FROM locations WHERE place_id = "${allLocations[z].location_id}"`;

        const queryResults = await executeDatabaseQuery(query);
        return queryResults;
      };

      const locationNames = await getLocationName();

      for (let p = 0; p < locationNames.length; p++) {
        const relativeDistance = calculateDistance(
          location.latitude,
          location.longitude,
          locationNames[p].latitude,
          locationNames[p].longitude
        );

        if (relativeDistance < closestLocationDistance) {
          closestLocationDistance = relativeDistance;

          closestLocationObj = {
            location_name: locationNames[p].location_name,
            address: locationNames[p].address,
            placeId: locationNames[p].place_id,
            latitude: locationNames[p].latitude,
            longitude: locationNames[p].longitude,
          };
        }
      }
    }

    const getPrice = async () => {
      const query = `SELECT price FROM main_man WHERE location_id = "${closestLocationObj.placeId}" AND destination_id= "${closestDestinationObj.placeId}"`;

      const queryResults = await executeDatabaseQuery(query);
      return queryResults;
    };

    const price = await getPrice();

    res.json({
      location: closestLocationObj,
      destination: closestDestinationObj,
      price: price[0].price,
    });
  }
});

// database query

app.post("/database", async (req, res) => {
  const placeType = req.body.placeType;

  const searchDatabase = async () => {
    const query = `SELECT * FROM ${placeType}`;
    const results = await executeDatabaseQuery(query);
    return results;
  };

  const queryResults = await searchDatabase();
  res.json(queryResults);
});

app.post("/related", async (req, res) => {
  let placeId = req.body.placeId;
  let placeType = req.body.type;

  const initialSearchDatabase = async () => {
    let initialQuery;
    if (placeType == "locations") {
      initialQuery = `SELECT destination_id,price FROM main_man WHERE location_id = "${placeId}"`;
      const initialResults = await executeDatabaseQuery(initialQuery);
      return initialResults;
    }
    if (placeType == "destinations") {
      initialQuery = `SELECT location_id,price FROM main_man WHERE destination_id = "${placeId}"`;
      const initialResults = await executeDatabaseQuery(initialQuery);

      return initialResults;
    }
  };

  const queryResults = await initialSearchDatabase();

  let secondSearchDatabase = async () => {
    let resultsArray = [];
    if (placeType == "locations") {
      for (let i = 0; i < queryResults.length; i++) {
        const secondQuery = `SELECT * FROM destinations WHERE place_id = "${queryResults[i].destination_id}"`;

        const secondResults = await executeDatabaseQuery(secondQuery);
        resultsArray.push(secondResults);
      }

      return resultsArray;
    }
    if (placeType == "destinations") {
      for (let i = 0; i < queryResults.length; i++) {
        const secondQuery = `SELECT * FROM locations WHERE place_id = "${queryResults[i].location_id}"`;

        const secondResults = await executeDatabaseQuery(secondQuery);

        resultsArray.push(secondResults);
      }
      return resultsArray;
    }
  };
  const relatedResults = await secondSearchDatabase();

  const unnestedRelatedResults = [];

  for (const subArray of relatedResults) {
    if (subArray.length > 0) {
      unnestedRelatedResults.push(subArray[0]);
    }
  }

  const prices = [];
  for (let i = 0; i < queryResults.length; i++) {
    prices.push(queryResults[i].price);
  }
  if (unnestedRelatedResults != undefined) {
    res.json({ results: unnestedRelatedResults, prices: prices });
  } else {
    res.json({ error: "an error occured" });
  }
});

function calculateDistance(
  locationLat,
  locationLng,
  destinationLat,
  destinationLng
) {
  locationLat = toRadians(locationLat);
  locationLng = toRadians(locationLng);
  destinationLat = toRadians(destinationLat);
  destinationLng = toRadians(destinationLng);

  let latDifference = destinationLat - locationLat;
  let lngDifference = destinationLng - locationLng;

  let a =
    Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
    Math.cos(locationLat) *
      Math.cos(destinationLat) *
      Math.sin(lngDifference / 2) *
      Math.sin(lngDifference / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let earthRadius = 6371;
  let distance = earthRadius * c;

  return distance;
}

function toRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

function executeDatabaseQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
