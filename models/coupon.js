const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 10,
      maxlength: 10,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

//"productId":"664f235916c62138976fcafa"
//"productId":"6638de15ba28d71d58634fb4"
