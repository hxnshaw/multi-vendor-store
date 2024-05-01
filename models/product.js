const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide A Business Name"],
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    description: {
      type: String,
      required: [true, "Description of Product cannot be empty"],
      trim: true,
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter The Product Price"],
      trim: true,
      default: 0,
    },
    images: {
      type: String,
      default: "/uploads/product_image.jpg",
    },
    category: {
      type: String,
      required: [true, "Please Enter The Product Category"],
      enum: [
        "Automotive",
        "Beauty",
        "Books",
        "Camera",
        "Consumer Electronics",
        "Fine Art",
        "Grocery",
        "Health & Personal Care",
        "Home & Garden",
        "Industrial & Scientific",
        "Musical Instruments",
        "Office Products",
        "Outdoors",
        "Pet Supplies",
        "Software",
        "Sports",
        "Video Games",
      ],
    },
    shop: {
      type: mongoose.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Product", productSchema);
