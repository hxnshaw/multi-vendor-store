const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

//Register Admin
exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  //check if email is already registered
  const alreadyRegistered = await Admin.findOne({ email });
  if (alreadyRegistered)
    throw new CustomError.BadRequestError("Email Already In Use");
  const user = await Admin.create({ username, email, password });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "created successfully", data: tokenUser });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new CustomError.BadRequestError("Please Provide Valid Credentials");

  //check if the user exists
  const user = await Admin.findOne({ email });
  if (!user) throw new CustomError.NotFoundError("User Does Not Exist");

  //check if the password is correct
  const passwordIsCorrect = await user.comparePassword(password);
  if (!passwordIsCorrect)
    throw new CustomError.BadRequestError("Password or Email Is Incorrect.");
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ message: "logged in successfully" });
};

exports.logoutAdmin = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "Logged Out" });
};

exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find({}).select("-password");
  if (admins === null) throw new CustomError.NotFoundError("Admins not found");
  res.status(StatusCodes.OK).json({ data: admins });
};

exports.viewMyAdminProfile = async (req, res) => {
  const adminId = req.user.userId;
  const admin = await Admin.findOne({ _id: adminId });
  if (!admin) throw new CustomError.NotFoundError("Admin not found");
  const tokenUser = createTokenUser(admin);
  res.status(StatusCodes.OK).json({ data: tokenUser });
};

exports.getSingleAdmin = async (req, res) => {
  const { id: adminId } = req.params;

  const admin = await Admin.findOne({ _id: adminId });
  if (!admin) throw new CustomError.NotFoundError("Admin not found");
  const tokenUser = createTokenUser(admin);
  res.status(StatusCodes.OK).json({ data: tokenUser });
};

exports.updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    throw new CustomError.BadRequestError("Incomplete credentials");
  const admin = await Admin.findOne({ _id: req.user.userId });
  if (!admin)
    throw new CustomError.NotFoundError("Admin not found, who goes you?");
  admin.password = newPassword;
  await admin.save();
  res.status(StatusCodes.OK).json({ message: "New Password Set" });
};
