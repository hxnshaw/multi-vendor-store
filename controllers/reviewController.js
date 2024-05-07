const Review = require("../models/review");
const Product = require("../models/product");
const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

exports.createReview = async (req, res) => {
  const { product: productId } = req.body;

  const productIsFound = await Product.findOne({ _id: productId });
  if (!productIsFound)
    throw new CustomError.NotFoundError(`No product found for ${productId}`);

  //Restrict Users from making more than one review.
  const reviewAlreadyExists = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (reviewAlreadyExists)
    throw new CustomError.BadRequestError(
      `Review already submitted for this product`
    );

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ message: "review saved", review });
};

exports.getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review)
    throw new CustomError.NotFoundError(`No review found for ${reviewId}`);
  res.status(StatusCodes.OK).json({ review });
};

exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name description price business",
  });
  res.status(StatusCodes.OK).json({ reviews, No_Of_Reviews: reviews.length });
};

exports.updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { comment } = req.body;

  const review = await Review.findOne({ _id: reviewId, user: req.user.userId });
  if (!review)
    throw new CustomError.NotFoundError(`No review found for ${reviewId}`);
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ message: "Updated successfully", review });
};

exports.deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId, user: req.user.userId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `Review with id ${reviewId} not found.`
    );
  }

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
};

//Get all the reviews associated with a product.
exports.getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await Review.find({ product: productId }).populate({
    path: "product",
    select: "name description price business",
  });
  res.status(StatusCodes.OK).json({ reviews });
};
