const Coupon = require("../models/coupon");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

//create coupon code
exports.createCoupon = async (req, res) => {
  const { code, productId, discountPercentage, expiryDate,isActive } = req.body;
  if (!code || !productId || !discountPercentage || !expiryDate)
    throw new CustomError.BadRequestError("Please provide all required fields");

  //check the date format
  if (!/^\d{1,2}-\d{1,2}-\d{4} \d{2}$/.test(expiryDate))
    throw new CustomError.BadRequestError("Date format must be: DD-MM-YYYY HH");

  //split the expiry date
  const [day, month, year, hour] = expiryDate.split(/[- ]/);
  /**
   * month starts from 0 in javascript. Hence month - 1.
   * For example, January to humans is 1, but in JavaScript, it is 0.
   * So to get January in this; 15-01-2024 you do month - 1 ie (1-1)
   */
  const expiresIn = new Date(year, month - 1, day, hour); 

  //check if the expiry date is still valid
  if (expiresIn < new Date())
    throw new CustomError.BadRequestError("Please enter a valid expiry date");

  const coupon = await Coupon.create({
    code,
    productId,
    expiryDate: expiresIn,
    discountPercentage,
    isActive
  });
  res.status(StatusCodes.CREATED).json({ message: "success", data: coupon });
};

exports.updateCouponCode = async (req, res) => {
  const { id: couponId } = req.params;
  const { code, productId, expiryDate, discountPercentage, isActive } =
    req.body;

  //split the expiry date
  const [day, month, year, hour] = expiryDate.split(/[- ]/);
  const expiresIn = new Date(year, month - 1, day, hour);
  if (expiresIn < new Date())
    throw new CustomError.BadRequestError("Please enter a valid expiry date");

  if (!code || !productId || !discountPercentage || !expiryDate || !isActive)
    throw new CustomError.BadRequestError("Please provide all required fields");

  //check if coupon code exists.
  const coupon = await Coupon.findOne({ couponId });
  if (!coupon) throw new CustomError.NotFoundError("Coupon code not found");
  coupon.code = code;
  coupon.productId = productId;
  coupon.expiryDate = expiresIn;
  coupon.discountPercentage = discountPercentage;
  coupon.isActive = isActive;

  await coupon.save();
  res.status(StatusCodes.OK).json(coupon);
};

exports.deleteCouponCode = async (req, res) => {
  const { id: couponId } = req.params;

  //check if coupon code exists.
  const coupon = await Coupon.findOne({ couponId });
  if (!coupon) throw new CustomError.NotFoundError("Coupon code not found");

  await coupon.deleteOne();
  res.status(StatusCodes.OK).json({ message: "coupon deleted successfully" });
};
