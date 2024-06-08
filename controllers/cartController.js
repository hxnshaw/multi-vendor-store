const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

exports.addToCart = async (req, res) => {
  const owner = req.user.userId;
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ owner });
  const item = await Product.findOne({ _id: itemId });

  if (!item) throw new CustomError.NotFoundError("Product not found");
  const price = item.price;
  const name = item.name;
  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    console.log(itemIndex);
    //if product exists already
    if (itemIndex > -1) {
      let product = cart.items[itemIndex];
      product.quantity += quantity;

      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart.items[itemIndex] = product;
      await cart.save();
      res.status(StatusCodes.OK).json({ message: "Cart updated", data: cart });
    } else {
      cart.items.push({ itemId, name, quantity, price });
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      await cart.save();
      res.status(200).send(cart);
    }
  } else {
    const newCart = await Cart.create({
      owner,
      items: [{ itemId, name, quantity, price }],
      bill: quantity * price,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Product added to your cart", data: newCart });
  }
};

exports.getCart = async (req, res) => {
  const owner = req.user.userId;

  const cart = await Cart.findOne({ owner });
  if (!cart) return res.status(StatusCodes.NOT_FOUND).json({ data: null });
  res.status(StatusCodes.OK).json({ cart });
};

exports.deleteFromCart = async (req, res) => {
  const owner = req.user.userId;
  const itemId = req.query.itemId;
  let cart = await Cart.findOne({ owner });

  const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    cart.bill -= item.quantity * item.price;
    if (cart.bill < 0) {
      cart.bill = 0;
    }
    cart.items.splice(itemIndex, 1);
    cart.bill = cart.items.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);
    cart = await cart.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "item deleted from your cart", cart });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Cart empty" });
  }
};

exports.applyCouponCode = async (req, res) => {
  const coupon = req.body.code;
  const owner = req.user.userId;
  if (!coupon) throw new CustomError.NotFoundError("Coupon code is required");

  const validCoupon = await Coupon.findOne({ code: coupon });
  if (
    !validCoupon ||
    validCoupon.expiryDate < new Date() ||
    validCoupon.isActive == false
  ) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Invalid coupon code" });
  }

  //find users cart
  const userCart = await Cart.findOne({ owner });
  if (!userCart) throw new CustomError.NotFoundError("Cart not found");
  let cartTotal = userCart.bill;
  /**
   * convert the discount percentage into a decimal, and calculate
   * the new cart total by multiplying the previous total and the discount factor.
   */
  cartTotal = cartTotal * (1 - validCoupon.discountPercentage / 100);
  userCart.bill = cartTotal;
  //userCart = await userCart.save();
  return res.status(StatusCodes.OK).json({ "cart total": cartTotal, userCart });
};

//log