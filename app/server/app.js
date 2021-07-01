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

app.listen(3000, () => {
  console.log("server is ready at port 3000");
});

//import routes
const restaurantOwnerRoutes = require("./router/restaurant-owner-routes");
const menuRoutes = require("./router/menu-routes");
const adminRoutes = require("./router/admin-routes");

//middleware (using the routes)
app.use("/api/restaurant-owner", restaurantOwnerRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
