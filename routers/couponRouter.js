const express = require("express");
const router = express.Router();
const {
  createCoupon,
  updateCouponCode,
  deleteCouponCode,
} = require("../controllers/couponController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//route for vendors to create coupon codes
router
  .route("/coupons/create-coupon-code")
  .post(authenticateUser, authorizePermissions("vendor"), createCoupon);

  //update coupon codes route
router
  .route("/coupons/update-coupon/:couponId")
  .put(authenticateUser, authorizePermissions("vendor"), updateCouponCode);

  //vendor route to delete coupon codes
router
  .route("/coupons/delete-coupon/:couponId")
  .delete(authenticateUser, authorizePermissions("vendor"), deleteCouponCode);

module.exports = router;
