const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  orderTotalPrice: {
    type: Number,
    default: 0,
  },
  orderItems: {
    type: [],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
