const Product = require("../models/product");
const Business = require("../models/business");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

exports.createProduct = async (req, res) => {
  req.body.owner = req.user.userId;
  const business = await Business.findOne({ owner: req.user.userId });
  req.body.shop = business;
  const product = await Product.create(req.body);
  console.log(business);
  res.status(StatusCodes.CREATED).json({ message: "success", data: product });
};

exports.getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product)
    throw new CustomError.NotFoundError(
      `No product found with id: ${productId}`
    );
  res.status(StatusCodes.OK).json({ data:product });
};
