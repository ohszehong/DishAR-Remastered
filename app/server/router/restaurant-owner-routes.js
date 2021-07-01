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
  bcrypt.hash(restaurantOwner.password, 15, function (err, hashedPassword) {
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
  });
});

router.get("/get-pending-restaurant-owners", (req, res) => {
  RestaurantOwner.find(
    { isApproved: false },
    { password: 0 },
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: err, msg: "server failure." });
      }
      if (results.length > 0) {
        return res.status(200).json({
          success: true,
          data: results,
          msg: "successfully fetch all the restaurant owners data",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: results,
          msg: "There is no any requests from restaurant owners",
        });
      }
    }
  );
});

router.post("/login-as-restaurant-owner", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //find the account with the same username and compare password
  RestaurantOwner.findOne({
    username: username,
    isApproved: true,
  }).then((restaurantOwner) => {
    if (!restaurantOwner) {
      return res.status(400).json({
        success: false,
        error: "User does not exists or still waiting for approval.",
      });
    }

    //otherwise, compare the password
    bcrypt.compare(
      password,
      restaurantOwner.password,
      (err, isCorrectPassword) => {
        if (err) {
          throw err;
        }

        //if password is correct
        if (isCorrectPassword) {
          //remove password to avoid returning password that might publicly accessed by other people
          delete restaurantOwner.password;
          return res.status(200).json({
            success: true,
            data: restaurantOwner,
            msg: "Login Success!",
            role: "restaurant owner",
          });
        } else {
          //else notify user that their credentials are invalid
          return res
            .status(401)
            .json({ success: false, error: "Invalid Credentials." });
        }
      }
    );
  });
});

module.exports = router;
