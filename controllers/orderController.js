const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

exports.createOrder = async (req, res) => {
  return res.status(StatusCodes.OK).json({ message: "hello" });
};

exports.getOrder = async (req, res) => {
  const owner = req.user.userId;

  const orders = await Order.findOne({ owner });
  if (!orders)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "orders not found" });
  res.status(StatusCodes.OK).json({ orders });
};
