const express = require("express");

const router = express.Router();

const { signupUser, loginUser } = require("./../controllers/authController");

const userController = require("./../controllers/userController");

// login route
router.post("/user/login", loginUser);

// signup route
router.post("/user/signup", signupUser);

router
  .route("/users/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/users/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
