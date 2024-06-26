const Order = require("../models/order");
const Cart = require("../models/cart");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const axios = require("axios");
const nodemailer = require("nodemailer");

// Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

//paystack
exports.createOrder = async (req, res) => {
  const owner = req.user.userId;
  let cart = await Cart.findOne({ owner });
  if (!cart) throw new CustomError.NotFoundError("Cart not found");
  const { shippingAddress } = req.body;
  let totalAmount = 0;
  shippingFee = 100;
  totalAmount = cart.bill + shippingFee;
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: req.user.email,
      amount: totalAmount * 100, // Paystack expects amount in kobo (smallest currency unit)
      metadata: {
        owner,
        items: cart.items,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Save the order in the database with status 'pending'
  const order = new Order({
    owner,
    items: cart.items,
    totalAmount,
    shippingAddress,
    status: "pending",
    reference: response.data.data.reference,
  });
  await order.save();
  cart = [];

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Payment initialized successfully",
    data: response.data.data, // Includes the payment URL
  });

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  //send an email to the customer to confirm that the order was saved.

  await transport.sendMail({
    to: req.user.email,
    from: "hello@multi-vendor-store.com",
    text: "Your order has been saved successfully. Your items will be shipped to you shortly.",
    html: "<p>Your order has been saved successfully. Your items will be shipped to you shortly.</p>",
    subject: "Your order has been placed successfully",
  });
};

exports.verifyPayment = async (req, res) => {
  const { reference } = req.params;
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data.data;

  if (data.status === "success") {
    // Update order status in the database
    const order = await Order.findOneAndUpdate(
      { reference },
      { status: "completed" },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Payment verified successfully",
      data: order,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Payment verification failed",
      data: response.data.data,
    });
  }
};

exports.getOrder = async (req, res) => {
  const owner = req.user.userId;

  const orders = await Order.findOne({ owner }).sort({ date: -1 });
  if (!orders)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "orders not found" });
  res.status(StatusCodes.OK).json({ orders });
};

//check the number of orders a vendor has made
//not working!
exports.vendorViewOrders = async (req, res) => {
   const vendorId = req.user.userId;
   const orders = await Order.find({ "items.vendorId":vendorId });
   //console.log(vendorId);
  if (!orders)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "orders not found" });
  res.status(StatusCodes.OK).json({ orders });

};
