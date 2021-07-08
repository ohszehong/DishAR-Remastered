const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

router.post("/create-order", (req, res) => {
  //when customer scan qr and move to the menu page, create a new order for them with empty items.
  Order.create({ restaurantId: req.body._id }, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when creating new order for customer.",
      });
    }
    return res.status(200).json({
      success: true,
      data: results,
      msg: "Successfully generate new order for customer.",
    });
  });
});

router.post("/update-order", (req, res) => {
  const orderTotalPrice = req.body.orderTotalPrice;
  const orderItem = req.body.orderItem;
  const orderId = req.body._id;

  console.log("order price: " + orderTotalPrice);
  console.log("order item: " + JSON.stringify(orderItem));
  console.log("order Id: " + orderId);

  Order.findByIdAndUpdate(
    orderId,
    { $addToSet: { orderItems: orderItem }, orderTotalPrice: orderTotalPrice },
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
          msg: "Internal server error when updating order.",
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
        msg: "Successfully update order",
      });
    }
  );
});

module.exports = router;
