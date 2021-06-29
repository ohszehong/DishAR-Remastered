const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connectDb = require("./mongodb-connection");

//mongodb connection
connectDb();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to node js");
});

app.listen(3000, () => {
  console.log("server is ready at port 3000");
});

//import routes
const restaurantOwnerRoute = require("./router/restaurant-owner-routes");
const menuRoute = require("./router/menu-routes");

//middleware (using the routes)
app.use("/api/restaurant-owner", restaurantOwnerRoute);
app.use("/api/menu", menuRoute);
