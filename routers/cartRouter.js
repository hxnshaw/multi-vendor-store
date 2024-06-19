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

//add products to cart
router.post(
  "/carts/add-to-cart",
  authenticateUser,
  authorizePermissions("buyer"),
  addToCart
);

//buyers route to view their cart
router
  .route("/carts/view-my-cart")
  .get(authenticateUser, authorizePermissions("buyer"), getCart);

  //route for buyers to apply coupon codes
router
  .route("/carts/view-my-cart/apply-coupon")
  .post(authenticateUser, authorizePermissions("buyer"), applyCouponCode);

  //buyer route to delete products from cart
router
  .route("/carts/view-my-cart/delete-item-from-cart")
  .delete(authenticateUser, authorizePermissions("buyer"), deleteFromCart);

module.exports = router;
