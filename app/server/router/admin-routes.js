const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Admin = require("../../models/Admin");
const RestaurantOwner = require("../../models/RestaurantOwner");
const Menu = require("../../models/Menu");

router.post("/login-as-admin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //find the account with the same username and compare password
  Admin.findOne({
    username: username,
  }).then((admin) => {
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exists." });
    }

    //otherwise, compare the password
    bcrypt.compare(password, admin.password, (err, isCorrectPassword) => {
      if (err) {
        throw err;
      }

      //if password is correct
      if (isCorrectPassword) {
        //remove password to avoid returning password that might publicly accessed by other people
        delete admin.password;
        return res.status(200).json({
          success: true,
          data: admin,
          msg: "Login Success!",
          role: "admin",
        });
      } else {
        //else notify user that their credentials are invalid
        return res
          .status(401)
          .json({ success: false, error: "Invalid Credentials." });
      }
    });
  });
});

router.post("/approve-restaurant-owner", (req, res) => {
  const restaurantOwnerId = req.body._id;

  if (!restaurantOwnerId) {
    return res
      .status(401)
      .json({ success: false, msg: "Insufficient information provided." });
  }

  //else if success, create a new menu for the restaurant owner
  let menu = new Menu({
    ownedBy: restaurantOwnerId,
    category: [],
    menuItems: [],
  });

  Menu.create(menu, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when creating menu.",
      });
    }

    //else if success, set restaurant owner isApproved attribute from false to true
    //and assign the new menu to the RO
    RestaurantOwner.findByIdAndUpdate(
      restaurantOwnerId,
      {
        $set: {
          isApproved: true,
          "restaurant.restaurantMenu": menu._id,
        },
      },
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err,
            msg: "Internal server error when updating RO.",
          });
        }
        return res
          .status(200)
          .json({ success: true, data: results, msg: "Approved!" });
      }
    );
  });
});

router.post("/reject-restaurant-owner", (req, res) => {
  const restaurantOwnerId = req.body._id;

  //Delete the restaurant owner record from the databSE
  RestaurantOwner.findByIdAndDelete(restaurantOwnerId, (err, results) => {
    if (!restaurantOwnerId) {
      return res
        .status(401)
        .json({ success: false, msg: "Insufficient information provided." });
    } else if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when deleting restaurant owner record.",
      });
    }

    return res
      .status(200)
      .json({ success: true, data: results, msg: "Rejected!" });
  });
});

module.exports = router;
