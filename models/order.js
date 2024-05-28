const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    shippingFee: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);