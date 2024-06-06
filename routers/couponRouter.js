const express = require("express");
const router = express.Router();
const { createCoupon } = require("../controllers/couponController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/coupons/create-coupon-code")
  .post(authenticateUser, authorizePermissions("admin"), createCoupon);

module.exports = router;
