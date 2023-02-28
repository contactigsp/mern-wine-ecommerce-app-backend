const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Field required"],
  },
  origin: {
    type: String,
    required: [true, "Field required"],
  },
  color: {
    type: String,
    required: [true, "Field required"],
  },
  description: {
    type: String,
    required: [true, "Field required"],
  },
  price: {
    type: Number,
    required: [true, "Field required"],
  },
  oldPrice: {
    type: Number,
    required: [true, "Field required"],
  },
  category: {
    type: String,
    required: [true, "Field required"],
  },
  image: {
    type: String,
    required: [true, "Field required"],
  },
});

const Products = new mongoose.model("Products", productsSchema);
module.exports = Products;
