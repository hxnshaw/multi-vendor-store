const express = require("express");
const router = express.Router();
const { createOrder, getOrder } = require("../controllers/orderController");

const {
  authenticateUser,
  // authorizePermissions,
} = require("../middleware/authentication");

router.route("/orders/checkout").post(authenticateUser, createOrder);

router.route("/orders/my-order-history").get(authenticateUser, getOrder);

module.exports = router;
