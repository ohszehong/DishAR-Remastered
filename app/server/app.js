const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const connectDb = require("./mongodb-connection");

//mongodb connection
connectDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to node js");
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log("server is ready at port " + PORT);
});

//import routes
const restaurantOwnerRoutes = require("./router/restaurant-owner-routes");
const menuRoutes = require("./router/menu-routes");
const adminRoutes = require("./router/admin-routes");
const foodRoutes = require("./router/food-routes");

//middleware (using the routes)
app.use("/api/restaurant-owner", restaurantOwnerRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
