const Buyer = require("../models/buyer");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const nodemailer = require("nodemailer");

//register buyer
exports.registerBuyer = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!email || !password || !first_name || !last_name)
    throw new CustomError.BadRequestError(
      "The details wey you give us no complete."
    );
  const emailAlreadyExists = await Buyer.findOne({ email: email });

  if (emailAlreadyExists)
    throw new CustomError.BadRequestError("Email Already In Use.");
  const user = await Buyer.create({ email, password, first_name, last_name });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });

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
    from: "hello@multi-buyer-store.com",
    text: "Welcome to The Multi-buyer-Store, we hope you enjoy your experience with us!",
    html: "<h1>Welcome to The Multi-buyer-Store</h1> <br>We hope you enjoy your experience with us!</br>",
    subject: "Welcome to The Multi-buyer-Store",
  });
};

//login buyer
exports.loginBuyer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new CustomError.BadRequestError("Incomplete credentials");
  const user = await Buyer.findOne({ email });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const passwordIsCorrect = await user.comparePassword(password);
  if (!passwordIsCorrect)
    throw new CustomError.BadRequestError("Invalid credentials");
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ message: "login successful" });
};

exports.logoutBuyer = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "You are logged out" });
};

exports.getAllBuyers = async (req, res) => {
  const buyers = await Buyer.findAll({}).select("-password");
  if (buyers === null) throw new CustomError.NotFoundError("Buyers not found");
  res
    .status(StatusCodes.OK)
    .json({ number_of_buyers: buyers.length, data: buyers });
};

exports.viewSingleBuyer = async (req, res) => {
  const { id: buyerId } = req.params;

  const buyer = await Buyer.findOne({ _id: buyerId });
  if (!buyer) throw new CustomError.NotFoundError("Buyer does not exist");
  const tokenUser = createTokenUser(buyer);
  res.status(StatusCodes.OK).json({ data: tokenUser });
};

exports.viewMyBuyerProfile = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

exports.updateBuyerPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    throw new CustomError.BadRequestError("Incomplete info");
  const buyer = await Buyer.findOne({ email: req.user.email });
  if (!buyer) throw new CustomError.NotFoundError("Not found");
  buyer.password = newPassword;
  await buyer.save();
  res.status(StatusCodes.OK).json({ message: "new password set" });
};

exports.buyerForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    throw new CustomError.BadRequestError("Please enter a valid email");
  const buyer = await Buyer.findOne({ email });
  if (!buyer) throw new CustomError.BadRequestError("Buyer not found");

  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await buyer.updateOne({ reset_code: resetCode });
  await buyer.save();

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
    from: "hello@multi-buyer-store.com",
    text: "Your passsword reset code is " + resetCode,
    html: "Your passsword reset code is " + resetCode,
    subject: "RESET YOUR PASSWORD - The Multi-buyer-Store.",
  });

  res.status(200).json({
    status: "Please check your email for the reset code",
  });
};

exports.buyerResetPassword = async (req, res) => {
  const { reset_code, email, new_password } = req.body;
  if (!reset_code || !email || !new_password)
    throw new CustomError.BadRequestError("Incomplete Credentials");

  const buyer = await Buyer.findOne({ email, reset_code });
  if (!buyer) throw new CustomError.NotFoundError("Reset code does not match");
  buyer.password = new_password;
  buyer.reset_code = "";
  await buyer.save();

  res.status(StatusCodes.OK).json({ message: "New Password Saved." });
};

exports.updateBuyerDetails = async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name)
    throw new CustomError.BadRequestError("Incomplete Credentials");
  const buyer = await Buyer.findOne({ email: req.user.email });
  if (!buyer) throw new CustomError.NotFoundError("Not found");
  console.log(buyer);
  buyer.first_name = first_name;
  buyer.last_name = last_name;
  await buyer.save();
  const tokenUser = createTokenUser(buyer);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ message: "Profile updated" });
};

exports.deleteBuyerProfile = async (req, res) => {
  const buyer = await Buyer.findOne({ email: req.user.email });
  if (!buyer) throw new CustomError.NotFoundError("Not found");
  res.cookie("token", "deleteUser", {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  await buyer.delete();
  res.status(StatusCodes.OK).json({ message: "Account Deleted" });
};

exports.deleteBuyerProfileByAdmin = async (req, res) => {
  const { id: buyerId } = req.params;
  const buyer = await Buyer.findOne({ _id: buyerId });
  if (!buyer) throw new CustomError.NotFoundError("Not found");
  await buyer.delete();
  res.status(StatusCodes.OK).json({ message: "Account Deleted" });
};
