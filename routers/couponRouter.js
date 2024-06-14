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

router
  .route("/coupons/create-coupon-code")
  .post(authenticateUser, authorizePermissions("vendor"), createCoupon);

router
  .route("/coupons/update-coupon/:couponId")
  .put(authenticateUser, authorizePermissions("vendor"), updateCouponCode);

router
  .route("/coupons/delete-coupon/:couponId")
  .delete(authenticateUser, authorizePermissions("vendor"), deleteCouponCode);

module.exports = router;
