const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
  viewAllProducts
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

//admin route to view all products
router
  .route("/products/view-products")
  .get(authenticateUser,  viewAllProducts);

//view a single product
router.route("/products/:id").get(authenticateUser, getSingleProduct);

module.exports = router;
