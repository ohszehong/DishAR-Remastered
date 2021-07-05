const express = require("express");
const router = express.Router();
const Menu = require("../../models/Menu");

router.post("/get-menu", (req, res) => {
  const restaurantOwnerId = req.body._id;

  Menu.findOne({ ownedBy: restaurantOwnerId }, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
        msg: "Internal server error when finding menu.",
      });
    }
    if (!results) {
      return res.status(400).json({ success: false, msg: "No such menu." });
    }
    return res.status(200).json({
      success: true,
      data: results,
      msg: "Successfully retrieve menu.",
    });
  });
});

module.exports = router;
