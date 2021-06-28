const mongoose = require("mongoose");
const roSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  restaurant: {
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantAddress: {
      type: String,
      required: true,
    },
    logoFilePath: {
      type: String,
    },
    restaurantMenu: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const RestaurantOwner = mongoose.model("restaurant-owner", roSchema);
module.exports = RestaurantOwner;
