const mongoose = require("mongoose");
const Orders = require("../models/ordersModel");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);
const { v4: uuidv4 } = require("uuid");

// ========================= GET ALL ORDERS =========================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: err.toString(),
    });
  }
};

// ========================= CREATE ORDER =========================

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      totalPriceItems,
      totalShippingOrder,
      totalTaxOrder,
      totalOrderPrice,
      user,
      isPaid,
      isDelivered,
      fullname,
      email,
    } = req.body;

    if (products && products.length === 0) {
      res.status(400);
      throw Error("No order items");
      return;
    }
    const order = await Orders.create({
      products,
      shippingAddress,
      paymentMethod,
      totalPriceItems,
      totalShippingOrder,
      totalTaxOrder,
      totalOrderPrice,
      user,
      isPaid,
      isDelivered,
      fullname,
      email,
    });

    res.status(201).json({
      message: "success",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// ========================= GET A SINGLE ORDER =========================
exports.getOrder = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "fail", order });
      throw Error("order not found in DB");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
    // }
  }
};

// ========================= UPDATE ORDER TO PAID =========================
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Orders.findById(req.body.orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        receipt_email: req.body.receipt_email,
        receipt_url: req.body.receipt_url,
        customer: req.body.customer,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw Error("Order not found in DB");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// ========================= CHECKOUT STRIPE =========================
exports.checkout = async (req, res) => {
  console.log(req.body);

  try {
    const { token, name, price, description } = req.body;
    const order = await Orders.findById(req.params.id);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const key = uuidv4();

    const charge = await stripe.charges.create(
      {
        amount: price.toString().split(".").join(""),
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: description,
        shipping: {
          name: token.card.name,
          address: {
            line1: order.shippingAddress.address,
            city: order.shippingAddress.city,
            postal_code: order.shippingAddress.postalCode,
          },
        },
      },
      {
        idempotencyKey: key,
      }
    );

    // console.log("Charge:", { charge });
    status = "success";
    res.json({
      status: "success",
      charge: { charge },
    });
  } catch (error) {
    console.log(error);
    status = "fail";
    res.json({ status: "fail", error });
  }
};

// ========================= SHOW ORDERS IN PROFILE =========================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// ========================= DELETE A PRODUCT =========================

// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Products.findByIdAndDelete(req.params.id);

//     if (!product /*means not null */) {
//       throw new Error("Product not found in db");
//     } else {
//       res.status(200).json(product);
//     }
//   } catch (error) {
//     if (
//       !mongoose.Types.ObjectId.isValid(req.params.id) ||
//       error.message === "Product not found in db"
//     ) {
//       return res.status(404).json({
//         status: "Not found",
//         message: "product not found in db",
//       });
//     } else {
//       console.log(error);
//       res.status(400).json({
//         status: "fail",
//         message: "Something went wrong",
//       });
//     }
//   }
// };

// ========================= UPDATE A PRODUCT =========================
// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!product /*means not null */) {
//       throw new Error("product not found in db");
//     } else {
//       res.status(200).json(
//         // status: "success",
//         // message: "Your product was successfully updated !!!",
//         product
//       );
//     }
//   } catch (error) {
//     if (
//       !mongoose.Types.ObjectId.isValid(req.params.id) ||
//       error.message === "product not found in db"
//     ) {
//       return res.status(404).json({
//         status: "Not found",
//         message: "product not found in db",
//       });
//     } else {
//       console.log(error);
//       res.status(400).json({
//         status: "fail",
//         message: "Something went wrong",
//       });
//     }
//   }
// };
