const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const buyerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    last_name: {
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
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 7,
    },
    role: {
      type: String,
      default: "buyer",
    },
  },
  { timestamps: true }
);

//Hash User Password
buyerSchema.pre("save", async function () {
    const buyer = this;
  
    if (!buyer.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    buyer.password = await bcrypt.hash(buyer.password, salt);
  });
  
  //check if password is correct.
  buyerSchema.methods.comparePassword = async function (buyerPassword) {
    const buyer = this;
    const isMatch = await bcrypt.compare(buyerPassword, buyer.password);
    return isMatch;
  };
  
  module.exports = mongoose.model("Buyer", buyerSchema);