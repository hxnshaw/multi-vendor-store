const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  deleteFromCart,
  applyCouponCode,
} = require("../controllers/cartController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post(
  "/carts/add-to-cart",
  authenticateUser,
  authorizePermissions("buyer"),
  addToCart
);

router
  .route("/carts/view-my-cart")
  .get(authenticateUser, authorizePermissions("buyer"), getCart);

router
  .route("/carts/view-my-cart/apply-coupon")
  .post(authenticateUser, authorizePermissions("buyer"), applyCouponCode);

router
  .route("/carts/view-my-cart/delete-item-from-cart")
  .delete(authenticateUser, authorizePermissions("buyer"), deleteFromCart);

module.exports = router;
