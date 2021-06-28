const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoDb =
    "mongodb+srv://DishARAdmin:DishARAdmin@cluster0.aerya.mongodb.net/dish-ar-database?retryWrites=true&w=majority";

  mongoose
    .connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
};
module.exports = connectDb;
