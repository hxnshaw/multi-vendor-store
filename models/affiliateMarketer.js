const mongoose = require("mongoose");

const affiliateMarketerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minlength: 3,
    maxlength: 50,
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
    default: "affiliateUser",
  },
});

module.exports = mongoose.model("affiliateMarketer", affiliateMarketerSchema);
