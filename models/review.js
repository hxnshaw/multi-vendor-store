const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide review comments"],
      maxlength: 500,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
