const mongoose = require("mongoose");
let dateNow = new Date();
let dateNowFormatted = dateNow.toISOString().split("T")[0];

const ordersSchema = new mongoose.Schema({
  products: {
    type: Array,
    required: [true, "Field required"],
  },
  shippingAddress: {
    type: Object,
    required: [true, "Field required"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Field required"],
  },
  totalPriceItems: {
    type: Number,
    required: [true, "Field required"],
  },
  totalShippingOrder: {
    type: Number,
    required: [true, "Field required"],
  },
  totalTaxOrder: {
    type: Number,
    required: [true, "Field required"],
  },
  totalOrderPrice: {
    type: Number,
    required: [true, "Field required"],
  },
  isPaid: { type: Boolean, required: [true, "Field required"] },
  isDelivered: { type: Boolean, required: [true, "Field required"] },
  user: {
    type: String,
    required: [true, "Field required"],
  },
  fullname: {
    type: String,
    required: [true, "Field required"],
  },
  email: {
    type: String,
    required: [true, "Field required"],
  },
  orderDate: {
    type: String,
    default: dateNowFormatted,
  },
  paidAt: {
    type: Date,
  },
  paymentResult: {
    type: Object,
  },
});

const Orders = new mongoose.model("Orders", ordersSchema);
module.exports = Orders;
