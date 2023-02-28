const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
const ordersController = require("./../controllers/ordersController");

// require auth for this routes
router.use(requireAuth);

router.route("/orders").post(ordersController.createOrder);

router.route("/myorders").get(ordersController.getMyOrders);

router
  .route("/orders/:id")
  .get(/*requireAuth,*/ ordersController.getOrder) //example of protecting a single route instead of all of them in page
  .post(ordersController.checkout);
// .delete(ordersController.deleteOrder)
// .patch(ordersController.updateOrder)

router
  .route("/orders/:id/updateOrderToPaid")
  .post(ordersController.updateOrderToPaid);

module.exports = router;
