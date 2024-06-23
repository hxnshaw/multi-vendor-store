const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getOrder,
  vendorViewOrders,
} = require("../controllers/orderController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//create order
router.route("/orders/checkout").post(authenticateUser, createOrder);

//verify payment
router
  .route("/orders/checkout/verify-payment/:reference")
  .post(authenticateUser, verifyPayment);

router.route("/orders/my-order-history").get(authenticateUser, getOrder);

router
  .route("/orders/my-dashboard")
  .get(authenticateUser, authorizePermissions("vendor"), vendorViewOrders);

module.exports = router;
