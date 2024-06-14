const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide A Business Name"],
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    phone_number: {
      type: String,
      required: [true, "Please Provide A Valid Phone Number"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please Provide A Valid Business Address"],
      trim: true,
    },
    about: {
      type: String,
      required: [true, "Please Provide A Brief Description of Your Business"],
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Business", businessSchema);
