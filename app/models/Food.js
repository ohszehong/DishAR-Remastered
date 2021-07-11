const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  foodPrice: {
    type: Number,
    required: true,
  },
  foodModelAssets: {
    foodObjFirebaseFilePath: {
      type: String,
      required: true,
    },
    foodObjWorkspaceFilePath: {
      type: String,
      required: true,
    },
    foodMtlFirebaseFilePath: {
      type: String,
      required: true,
    },
    foodMtlWorkspaceFilePath: {
      type: String,
      required: true,
    },
    foodTextureFirebaseFilePath: {
      type: String,
      required: true,
    },
    foodTextureWorkspaceFilePath: {
      type: String,
      required: true,
    },
  },
  foodThumbnailFilePath: {
    type: String,
    required: true,
  },
  foodNutritionalFacts: {
    foodCalories: {
      type: Number,
      required: true,
    },
    foodProtein: {
      type: Number,
      required: true,
    },
    foodCarbohydrates: {
      type: Number,
      required: true,
    },
    foodFat: {
      type: Number,
      required: true,
    },
  },
  foodDesc: {
    type: String,
    required: true,
  },
  foodIngredients: {
    type: String,
  },
  foodAvailable: {
    type: Boolean,
    default: true,
  },
});

const Food = mongoose.model("foods", foodSchema);
module.exports = Food;
