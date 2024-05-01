const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//register a new business
router.post(
  "/products/register",
  authenticateUser,
  authorizePermissions("vendor"),
  createProduct
);

//view a single product
router.route("/products/:id").get(authenticateUser, getSingleProduct);

module.exports = router;
