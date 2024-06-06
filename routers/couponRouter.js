const express = require("express");
const router = express.Router();
const {
  createCoupon,
  updateCouponCode,
} = require("../controllers/couponController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/coupons/create-coupon-code")
  .post(authenticateUser, authorizePermissions("admin"), createCoupon);

router
  .route("/coupons/update-coupon/:couponId")
  .put(authenticateUser, authorizePermissions("admin"), updateCouponCode);

module.exports = router;
