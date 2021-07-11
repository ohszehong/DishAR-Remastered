const express = require("express");
const router = express.Router();
const RestaurantOwner = require("../../models/RestaurantOwner");
const Food = require("../../models/Food");
const Menu = require("../../models/Menu");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

var https = require("https");
var fs = require("fs");

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  https.get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close(cb);
    });
  });
};

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

router.post("/get-restaurant-owner", (req, res) => {
  const restaurantOwnerId = req.body._id;

  RestaurantOwner.findById(
    restaurantOwnerId,
    { password: 0 },
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: err, msg: "server failure." });
      }
      return res.status(200).json({
        success: true,
        data: results,
        msg: "Redirecting to menu...",
      });
    }
  );
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

router.post("/add-food-to-menu", (req, res) => {
  const restaurantOwnerId = req.body.restaurantOwnerId;
  const foodName = req.body.foodName;

  //get all the file paths (firebase and workspace)
  const foodObjFirebaseFilePath =
    req.body.foodModelAssets.foodObjFirebaseFilePath;
  const foodObjWorkspaceFilePath =
    req.body.foodModelAssets.foodObjWorkspaceFilePath;

  const foodMtlFirebaseFilePath =
    req.body.foodModelAssets.foodMtlFirebaseFilePath;
  const foodMtlWorkspaceFilePath =
    req.body.foodModelAssets.foodMtlWorkspaceFilePath;

  const foodTextureFirebaseFilePath =
    req.body.foodModelAssets.foodTextureFirebaseFilePath;
  const foodTextureWorkspaceFilePath =
    req.body.foodModelAssets.foodTextureWorkspaceFilePath;

  const foodThumbnailFilePath = req.body.foodThumbnailFilePath;

  //then, save the data to the database
  const foodPrice = parseFloat(req.body.foodPrice);
  const foodCalories = parseInt(req.body.foodNutritionalFacts.foodCalories);
  const foodProtein = parseInt(req.body.foodNutritionalFacts.foodProtein);
  const foodCarbohydrates = parseInt(
    req.body.foodNutritionalFacts.foodCarbohydrates
  );
  const foodFat = parseInt(req.body.foodNutritionalFacts.foodFat);
  const foodDesc = req.body.foodDesc;
  const foodIngredients = req.body.foodIngredients;

  let food = new Food({
    from: restaurantOwnerId,
    foodName: foodName,
    foodPrice: foodPrice,
    foodModelAssets: {
      foodObjFirebaseFilePath: foodObjFirebaseFilePath,
      foodObjWorkspaceFilePath: foodObjWorkspaceFilePath,
      foodMtlFirebaseFilePath: foodMtlFirebaseFilePath,
      foodMtlWorkspaceFilePath: foodMtlWorkspaceFilePath,
      foodTextureFirebaseFilePath: foodTextureFirebaseFilePath,
      foodTextureWorkspaceFilePath: foodTextureWorkspaceFilePath,
    },
    foodThumbnailFilePath: foodThumbnailFilePath,
    foodNutritionalFacts: {
      foodCalories: parseInt(foodCalories),
      foodProtein: parseInt(foodProtein),
      foodCarbohydrates: parseInt(foodCarbohydrates),
      foodFat: parseInt(foodFat),
    },
    foodDesc: foodDesc,
    foodIngredients: foodIngredients,
  });

  Food.create(food, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when creating food.",
      });
    }

    //if success create food document, add its id to the menu
    const foodId = results._id;

    Menu.findOneAndUpdate(
      { ownedBy: restaurantOwnerId },
      { $addToSet: { menuItems: foodId } },
      { useFindAndModify: false },
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err,
            msg: "Internal server error when adding food to menu.",
          });
        }
        return res.status(200).json({
          success: true,
          data: results,
          msg: "Successfully added food to menu.",
        });
      }
    );
  });
});

router.post("/edit-food-details", (req, res) => {
  const foodId = req.body._id;
  const foodPrice = req.body.foodPrice;
  const foodDesc = req.body.foodDesc;
  const foodNutritionalFacts = req.body.foodNutritionalFacts;
  const foodIngredients = req.body.foodIngredients;

  Food.findByIdAndUpdate(
    foodId,
    {
      foodPrice: foodPrice,
      foodDesc: foodDesc,
      foodNutritionalFacts: foodNutritionalFacts,
      foodIngredients: foodIngredients,
    },
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
          msg: "Internal server error when updating food details.",
        });
      }
      return res.status(200).json({
        success: true,
        data: results,
        msg: "Successfully update food details.",
      });
    }
  );
});

router.post("/delete-food-from-menu", (req, res) => {
  //delete data in Food collection
  const restaurantOwnerId = req.body.restaurantOwnerId;
  const foodId = mongoose.Types.ObjectId(req.body.foodId);

  Food.findByIdAndDelete(foodId, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when deleting food from menu.",
      });
    }
  });

  //if success, delete food id in Menu collection
  Menu.updateOne(
    { ownedBy: restaurantOwnerId },
    { $pull: { menuItems: foodId } },
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
          msg: "Internal server error when removing food Id from menu.",
        });
      }

      if (results.nModified === 0) {
        return res.status(400).json({
          success: false,
          msg: "Already deleted from database, please refresh the menu in menu section.",
        });
      }
      return res.status(200).json({
        success: true,
        data: results,
        msg: "Successfully delete food from menu.",
      });
    }
  );
});

router.post("/upload-files-to-workspace", (req, res) => {
  const foodObjWorkspaceFilePath = req.body.foodObjWorkspaceFilePath;
  const foodObjFirebaseFileUrl = req.body.foodObjFirebaseFileUrl;
  const restaurantOwnerDirectory = req.body.restaurantOwnerDirectory;

  //check if directory to the restaurant owner folder exists first
  if (!fs.existsSync(restaurantOwnerDirectory)) {
    fs.mkdirSync(restaurantOwnerDirectory, { recursive: true });
  }

  download(foodObjFirebaseFileUrl, foodObjWorkspaceFilePath, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when uploading files to workspace.",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Successfully uploaded files to workspace.",
    });
  });
});

module.exports = router;
