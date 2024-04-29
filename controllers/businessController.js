const Business = require("../models/business");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const nodemailer = require("nodemailer");

exports.registerBusiness = async (req, res) => {
  req.body.owner = req.user.userId;
  const { name, phone_number, address, about } = req.body;

  const alreadyOwnsABusiness = await Business.findOne({
    owner: req.user.userId,
  });
  if (alreadyOwnsABusiness)
    throw new CustomError.BadRequestError(
      "You can only register one business!"
    );
  if (!name || !phone_number || !address || !about)
    throw new CustomError.BadRequestError(
      "Please provide all required information"
    );
  const business = await Business.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "success", data: business });

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transport.sendMail({
    to: req.user.email,
    from: "hello@multi-buyer-store.com",
    text: "Your Shop Has Been Registered, Please Login To Continue!",
    html: "<h1>Shop Successfully Registered!</h1> <br>Your Shop Has Been Registered, Please Login To Your Account To Continue!</br>",
    subject: "Shop Successfully Registered!",
  });
};

exports.getSingleBusiness = async (req, res) => {
  const { id: businessId } = req.params;
  const business = await Business.findOne({ _id: businessId }).populate({
    path: "owner",
    select: "first_name last_name email",
  });
  if (!business)
    throw new CustomError.NotFoundError("Business shop does not exist.");
  res.status(StatusCodes.OK).json({ data: business });
};

exports.getAllBusinesses = async (req, res) => {
  const businesses = await Business.find({}).populate({
    path: "owner",
    select: "first_name last_name email",
  });
  if (businesses === null)
    throw new CustomError.NotFoundError("Business shops not found.");
  res
    .status(StatusCodes.OK)
    .json({ numberOfBusinesses: businesses.length, data: businesses });
};

exports.updateBusiness = async (req, res) => {
  const { name, phone_number, address, about } = req.body;
  const { id: businessId } = req.params;
  if (!name || !phone_number || !address || !about)
    throw new CustomError.BadRequestError("Incomplete Credentials");
  const business = await Business.findOne({
    _id: businessId,
    owner: req.user.userId,
  });
  if (!business) throw new CustomError.NotFoundError("Not found");
  business.name = name;
  business.phone_number = phone_number;
  business.address = address;
  business.about = about;
  await business.save();
  res.status(StatusCodes.OK).json({ data: business });
};

exports.deleteBusiness = async (req, res) => {
  const { id: businessId } = req.params;
  const business = await Business.findOne({ _id: businessId });
  if (!business) throw new CustomError.NotFoundError("Business Not Found");
  await business.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Business deleted successfully" });
};
