const mongoose = require("mongoose");
const validator = require("validator");

const affiliateMarketerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address.",
    },
  },
  role: {
    type: String,
    default: "AffiliateMarketer",
  },
});

module.exports = mongoose.model("AffiliateMarketer", affiliateMarketerSchema);
