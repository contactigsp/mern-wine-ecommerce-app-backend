const express = require("express");

const router = express.Router();
const productsController = require("./../controllers/productsController");

// require auth for this routes
// const requireAuth = require("./../middleware/requireAuth");

// router.use(requireAuth);

router
  .route("/products")
  .get(productsController.getAllProducts)
  .post(productsController.createProduct);

router.route("/products/gifts").get(productsController.getGiftProducts);
router.route("/products/combos").get(productsController.getCombosProducts);
router.route("/products/kits").get(productsController.getKitsProducts);
router.route("/products/wood").get(productsController.getWoodProducts);

router
  .route("/product/:id")
  .get(productsController.getProduct)
  .delete(productsController.deleteProduct)
  .patch(productsController.updateProduct);

module.exports = router;
