const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const vendorSchema = new mongoose.Schema(
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
    reset_code: {
      type: Number,
    },
    role: {
      type: String,
      default: "vendor",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

vendorSchema.virtual("business", {
  ref: "Business",
  localField: "_id",
  foreignField: "owner",
});

//Hash User Password
vendorSchema.pre("save", async function () {
  const vendor = this;

  if (!vendor.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  vendor.password = await bcrypt.hash(vendor.password, salt);
});

//check if password is correct.
vendorSchema.methods.comparePassword = async function (vendorPassword) {
  const vendor = this;
  const isMatch = await bcrypt.compare(vendorPassword, vendor.password);
  return isMatch;
};

module.exports = mongoose.model("Vendor", vendorSchema);
