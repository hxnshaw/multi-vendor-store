const Vendor = require("../models/vendor");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const nodemailer = require("nodemailer");

//register vendor
exports.registerVendor = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!email || !password || !first_name || !last_name)
    throw new CustomError.BadRequestError("Incomeplete Details.");
  const emailAlreadyExists = await Vendor.findOne({ email: email });

  if (emailAlreadyExists)
    throw new CustomError.BadRequestError("Email Already In Use.");
  const user = await Vendor.create({ email, password, first_name, last_name });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });

  //send the new vendor a welcome mail
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transport.sendMail({
    to: tokenUser.email,
    from: "hello@multi-vendor-store.com",
    text: "Welcome to The Multi-Vendor-Store, we hope you enjoy your experience with us, and make alot of sales!",
    html: "<h3>Welcome to The Multi-Vendor-Store</h3> <br>We hope you enjoy your experience with us, and make alot of sales!</br>",
    subject: "Welcome to The Multi-Vendor-Store",
  });
};

//login vendor
exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new CustomError.BadRequestError("Incomplete credentials");
  const user = await Vendor.findOne({ email });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const passwordIsCorrect = await user.comparePassword(password);
  if (!passwordIsCorrect)
    throw new CustomError.BadRequestError("Invalid credentials");
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ message: "login successful" });
};

exports.logoutVendor = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "You are logged out" });
};

exports.getAllVendors = async (req, res) => {
  const vendors = await Vendor.find({}).select("-password");
  if (vendors === null)
    throw new CustomError.NotFoundError("Vendors not found");
  res
    .status(StatusCodes.OK)
    .json({ number_of_vendors: vendors.length, data: vendors });
};

exports.viewSingleVendor = async (req, res) => {
  const { id: vendorId } = req.params;

  const vendor = await Vendor.findOne({ _id: vendorId }).select(
    "-password -reset_code -createdAt -updatedAt"
  );
  await vendor.populate("business");
  if (!vendor) throw new CustomError.NotFoundError("Vendor does not exist");
  res.status(StatusCodes.OK).json({ data: vendor });
};

exports.viewMyVendorProfile = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

exports.updateVendorPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    throw new CustomError.BadRequestError("Incomplete info");
  const vendor = await Vendor.findOne({ email: req.user.email });
  if (!vendor) throw new CustomError.NotFoundError("Not found");
  vendor.password = newPassword;
  await vendor.save();
  res.status(StatusCodes.OK).json({ message: "new password set" });
};

exports.vendorForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    throw new CustomError.BadRequestError("Please enter a valid email");
  const vendor = await Vendor.findOne({ email });
  if (!vendor) throw new CustomError.BadRequestError("vendor not found");

  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await vendor.updateOne({ reset_code: resetCode });
  await vendor.save();

  //send reset code via mail to the vendor
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transport.sendMail({
    to: email,
    from: "hello@multi-vendor-store.com",
    text: "Your passsword reset code is " + resetCode,
    html: "<p>Your passsword reset code is </p>" + resetCode,
    subject: "RESET YOUR PASSWORD - The Multi-Vendor-Store.",
  });

  res.status(200).json({
    status: "Please check your email for the reset code",
  });
};

exports.vendorResetPassword = async (req, res) => {
  const { reset_code, email, new_password } = req.body;
  if (!reset_code || !email || !new_password)
    throw new CustomError.BadRequestError("Incomplete Credentials");

  const vendor = await Vendor.findOne({ email, reset_code });
  if (!vendor) throw new CustomError.NotFoundError("Reset code does not match");
  vendor.password = new_password;
  vendor.reset_code = "";
  await vendor.save();

  res.status(StatusCodes.OK).json({ message: "New Password Saved." });
};

exports.updateVendorDetails = async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name)
    throw new CustomError.BadRequestError("Incomplete Credentials");
  const vendor = await Vendor.findOne({ email: req.user.email });
  if (!vendor) throw new CustomError.NotFoundError("Not found");
  vendor.first_name = first_name;
  vendor.last_name = last_name;
  await vendor.save();
  const tokenUser = createTokenUser(vendor);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ message: "Profile updated" });
};

exports.deleteVendorProfile = async (req, res) => {
  const vendor = await Vendor.findOne({ email: req.user.email });
  if (!vendor) throw new CustomError.NotFoundError("Not found");
  res.cookie("token", "deleteUser", {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  await vendor.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Account Deleted" });
};

exports.deleteVendorProfileByAdmin = async (req, res) => {
  const { id: vendorId } = req.params;
  const vendor = await Vendor.findOne({ _id: vendorId });
  if (!vendor) throw new CustomError.NotFoundError("Not found");
  await vendor.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Account Deleted" });
};
