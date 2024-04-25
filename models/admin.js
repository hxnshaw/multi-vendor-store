const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: {
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
      default: "admin",
    },
  },
  { timestamps: true }
);

//Hash User Password
adminSchema.pre("save", async function () {
  const admin = this;

  if (!admin.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
});

//check if password is correct.
adminSchema.methods.comparePassword = async function (adminPassword) {
  const admin = this;
  const isMatch = await bcrypt.compare(adminPassword, admin.password);
  return isMatch;
};

module.exports = mongoose.model("Admin", adminSchema);
