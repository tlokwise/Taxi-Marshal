const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3333;

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
app.get("/database", (req, res) => {
  res.render("database");
});
app.get("/mapper", (req, res) => {
  res.render("mapper");
});
//
app.post("/submit", async (req, res) => {
  const dataType = req.body.type;
  const dataName = req.body.name;
  const dataAddress = req.body.address;
  const dataPlaceId = req.body.placeId;
  const dataLatitude = req.body.latitude;
  const dataLongitude = req.body.longitude;

  const insertData = async () => {
    const query = `INSERT INTO ${dataType}s VALUES ('${dataPlaceId}', '${dataName}', '${dataAddress}', ${dataLatitude}, ${dataLongitude})`;
    const results = await executeDatabaseQuery(query);

    return results;
  };
  const isInserted = await insertData();
  console.log(isInserted);
  res.json(isInserted);
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

//mapping locations to destinations
app.post("/placemapper", async (req, res) => {
  const searchDatabase = async () => {
    const query = "SELECT location_id, destination_id FROM main_man";
    const queryMainMan = await executeDatabaseQuery(query);
    return queryMainMan;
  };

  const mainManResults = await searchDatabase();
  let location = [];
  let destination = [];
  for (let i = 0; i < mainManResults.length; i++) {
    const currentLocationId = mainManResults[i].location_id;
    const currentDestinationId = mainManResults[i].destination_id;
    const searchForLocation = async () => {
      const locationQuery = `SELECT location_name, address FROM locations WHERE place_id = "${currentLocationId}"`;

      const locationResults = await executeDatabaseQuery(locationQuery);
      return locationResults;
    };

    const searchForDestination = async () => {
      const destinationQuery = `SELECT destination_name, address FROM destinations WHERE place_id = "${currentDestinationId}"`;

      const destinationResults = await executeDatabaseQuery(destinationQuery);
      return destinationResults;
    };

    const locationResults = await searchForLocation();
    const destinationResults = await searchForDestination();
    location.push(locationResults);
    destination.push(destinationResults);
  }
  const finalLocation = [];
  const finalDestination = [];
  for (const subArray of location) {
    if (subArray.length > 0) {
      finalLocation.push(subArray[0]);
    }
  }
  for (const subArray of destination) {
    if (subArray.length > 0) {
      finalDestination.push(subArray[0]);
    }
  }
  res.json({ location: finalLocation, destination: finalDestination });
});

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
