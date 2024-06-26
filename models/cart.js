const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Buyer",
    },
    items: [
      {
        itemId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        vendorId: {
          type: mongoose.Types.ObjectId,
          ref: "Vendor",
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
