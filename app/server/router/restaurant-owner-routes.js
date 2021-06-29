const express = require("express");
const router = express.Router();
const RestaurantOwner = require("../../models/RestaurantOwner");
const bcrypt = require("bcrypt");

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

  //hash the password using bycrypt library
  const saltRounds = 15;
  bcrypt.hash(
    restaurantOwner.password,
    saltRounds,
    function (err, hashedPassword) {
      if (err) {
        console.log(err);
      }
      restaurantOwner.password = hashedPassword;
      RestaurantOwner.create(restaurantOwner, (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, data: results });
      });
    }
  );
});

module.exports = router;
