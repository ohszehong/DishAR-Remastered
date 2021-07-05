const express = require("express");
const router = express.Router();
const Food = require("../../models/Food");

router.post("/get-food", (req, res) => {
  const foodId = req.body._id;

  Food.findById(foodId, (err, results) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
        msg: "Internal server error when finding the food.",
      });
    }
    if (!results) {
      return res.status(400).json({ success: false, msg: "No such food." });
    }
    return res.status(200).json({
      success: true,
      data: results,
      msg: "Successfully retrieve food.",
    });
  });
});

module.exports = router;
