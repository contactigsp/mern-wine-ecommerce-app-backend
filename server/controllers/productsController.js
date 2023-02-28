const mongoose = require("mongoose");
const Products = require("./../models/productsModel");

// ========================= GET ALL PRODUCTS =========================
exports.getAllProducts = async (req, res) => {
  try {

    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, req.query); // this is to compare the original req and the query we excluded the undesired elements.

    // EXECUTE THE QUERY
    const query = Products.find(queryObj); // We gotta await only after the filtering in order to work.





    console.log(req.query);
    const products = await Products.find(query).sort({ createAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: err.toString(),
    });
  }
};

exports.getGiftProducts = async (req, res, next) => {
  try {
    // ======================== OPTION 1 ========================
    // const gifts = await Products.find({
    //   category: "gift",
    // });

    // res.status(200).json(gifts);
    // ====================== END OPTION 1 =====================
    // ======================== OPTION 2 ========================
    const gifts = await Products.find().where("category").equals("gift");
    // .where("origin")
    // .equals("Venezuela");

    // ====================== END OPTION 2 =====================
    // ======================== OPTION 3 ========================
    // BUILD THE QUERY

    // const queryObj = { ...req.query };
    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, req.query); // this is to compare the original req and the query we excluded the undesired elements.

    // EXECUTE THE QUERY
    // const query = Products.find(queryObj); // We gotta await only after the filtering in order to work.

    // const gifts = await Products.find(query);

    // ====================== END OPTION 3 =====================
    res.status(200).json(gifts);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getKitsProducts = async (req, res, next) => {
  try {
    const kits = await Products.find().where("category").equals("kit");
    res.status(200).json(kits);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getWoodProducts = async (req, res, next) => {
  try {
    const wood = await Products.find().where("category").equals("wood");
    res.status(200).json(wood);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getCombosProducts = async (req, res, next) => {
  try {
    const combos = await Products.find().where("category").equals("combo");
    res.status(200).json(combos);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ========================= CREATE A SINGLE PRODUCT =========================

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Products.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// ========================= GET A SINGLE PRODUCT =========================
exports.getProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    res.status(200).json(product);
  } catch (error) {
    // if (
    // !mongoose.Types.ObjectId.isValid(req.params.id) ||
    // error.message === "Product not found in db"
    // ) {
    // return res.status(404).json({
    // status: "Not found",
    // message: "Product not found in db",
    // });
    // } else {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
    // }
  }
};

// ========================= DELETE A PRODUCT =========================

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);

    if (!product /*means not null */) {
      throw new Error("Product not found in db");
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      error.message === "Product not found in db"
    ) {
      return res.status(404).json({
        status: "Not found",
        message: "product not found in db",
      });
    } else {
      console.log(error);
      res.status(400).json({
        status: "fail",
        message: "Something went wrong",
      });
    }
  }
};

// ========================= UPDATE A PRODUCT =========================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product /*means not null */) {
      throw new Error("product not found in db");
    } else {
      res.status(200).json(
        // status: "success",
        // message: "Your product was successfully updated !!!",
        product
      );
    }
  } catch (error) {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      error.message === "product not found in db"
    ) {
      return res.status(404).json({
        status: "Not found",
        message: "product not found in db",
      });
    } else {
      console.log(error);
      res.status(400).json({
        status: "fail",
        message: "Something went wrong",
      });
    }
  }
};
