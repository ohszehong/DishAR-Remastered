const express = require("express");
const router = express.Router();
const RestaurantOwner = require("../../models/RestaurantOwner");

router.post("/register-restaurant-owner", (req, res) => {
  let restaurantOwner = new RestaurantOwner({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    contactNo: req.body.contactNo,
    restaurant: req.body.restaurant,
  });

  //create unique index
  //RestaurantOwner.createIndexes({ username: 1 }, { unique: true });

  RestaurantOwner.create(restaurantOwner, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    return res.status(200).json({ success: true, data: results });
  });
});

module.exports = router;
