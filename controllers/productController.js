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
  await product.populate("reviews");
  if (!product)
    throw new CustomError.NotFoundError(
      `No product found with id: ${productId}`
    );
  res.status(StatusCodes.OK).json({ data: product });
};

exports.viewAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  let sort = req.query.sort || "category";
  let category = req.query.category || "All";

  const categoryOptions = [
    "Automotive",
    "Beauty",
    "Books",
    "Camera",
    "Clothing",
    "Consumer Electronics",
    "Fine Art",
    "Grocery",
    "Health & Personal Care",
    "Home & Garden",
    "Industrial & Scientific",
    "Musical Instruments",
    "Office Products",
    "Outdoors",
    "Pet Supplies",
    "Shoes",
    "Software",
    "Sports",
    "Video Games",
  ];

  category === "All"
    ? (category = [...categoryOptions])
    : (category = req.query.category.split(","));
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  })
    .where("category")
    .in([...category])
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  const total = await Product.countDocuments({
    category: { $in: [...category] },
    name: { $regex: search, $options: "i" },
  });

  const response = {
    error: false,
    total,
    page: page + 1,
    limit,
    // categories: categoryOptions,
    products,
  };
  res.status(StatusCodes.OK).json({ data: response });
};

exports.updateAProduct = async (req, res) => {
  const { name, price, image, description, category } = req.body;
  const { id: productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    owner: req.user.userId,
  });
  if (!product)
    throw new CustomError.NotFoundError(
      `No Product found with id:${productId}`
    );
  product.name = name;
  product.price = price;
  product.image = image;
  product.description = description;
  product.category = category;

  await product.save();
  res.status(StatusCodes.OK).json({ message: "Updated successfully", product });
};

exports.deleteAProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
    owner: req.user.userId,
  });

  if (!product)
    throw new CustomError.NotFoundError(
      `No Product found with id:${productId}`
    );
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Product Deleted" });
};

exports.uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "multi-vendor-store",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({
    message: "Image successfully uploaded successfully",
    image: { src: result.secure_url },
  });
};
