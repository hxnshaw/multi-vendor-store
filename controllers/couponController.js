const Coupon = require("../models/coupon");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

exports.createCoupon = async (req, res) => {
  const { code, productId, discountPercentage, expiryDate } = req.body;
  if (!code || !productId || !discountPercentage || !expiryDate)
    throw new CustomError.BadRequestError("Please provide all required fields");

  //check the date format
  if (!/^\d{1,2}-\d{1,2}-\d{4} \d{2}$/.test(expiryDate))
    throw new CustomError.BadRequestError("Date format must be: DD-MM-YYYY HH");

  //split the expiry date
  const [day, month, year, hour] = expiryDate.split(/[- ]/);
  const expiresIn = new Date(year, month - 1, day, hour);

  //check if the expiry date is still valid
  if (expiresIn < new Date())
    throw new CustomError.BadRequestError("Please enter a valid expiry date");

  const coupon = await Coupon.create({
    code,
    productId,
    expiryDate: expiresIn,
    discountPercentage,
  });
  res.status(StatusCodes.CREATED).json({ message: "success", data: coupon });
};

exports.updateCouponCode = async (req, res) => {
  const { id: couponId } = req.params;
  const { code, productId, expiryDate, discountPercentage } = req.body;

  //split the expiry date
  const [day, month, year, hour] = expiryDate.split(/[- ]/);
  const expiresIn = new Date(year, month - 1, day, hour);
  if (expiresIn < new Date())
    throw new CustomError.BadRequestError("Please enter a valid expiry date");

  if (!code || !productId || !discountPercentage || !expiryDate)
    throw new CustomError.BadRequestError("Please provide all required fields");

  //check if coupon coded exists.
  const coupon = await Coupon.findOne({ couponId });
  if (!coupon) throw new CustomError.NotFoundError("Coupon code not found");
  coupon.code = code;
  coupon.productId = productId;
  coupon.expiryDate = expiresIn;
  coupon.discountPercentage = discountPercentage;

  await coupon.save();
  res.status(StatusCodes.OK).json(coupon);
};
