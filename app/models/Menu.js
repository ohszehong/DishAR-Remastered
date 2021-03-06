const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  category: {
    type: [],
  },
  menuItems: {
    type: [],
  },
});

const Menu = mongoose.model("restaurant-owners-menus", menuSchema);
module.exports = Menu;
