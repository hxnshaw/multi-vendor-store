const express = require("express");
const router = express.Router();
const {
  createProduct,
  getSingleProduct,
  viewAllProducts,
  deleteAProduct,
  updateAProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//register a new product
router.post(
  "/products/register",
  authenticateUser,
  authorizePermissions("vendor"),
  createProduct
);

//upload product image
router
  .route("/products/register/upload-image")
  .post(authenticateUser, authorizePermissions("vendor"), uploadImage);

// view all products
router.route("/products/view-products").get(authenticateUser, viewAllProducts);

//view a single product
router.route("/products/:id").get(authenticateUser, getSingleProduct);

//update a product
router
  .route("/products/view-products/update/:id")
  .put(authenticateUser, authorizePermissions("vendor"), updateAProduct);

//delete a product
router
  .route("/products/view-products/delete/:id")
  .delete(authenticateUser, authorizePermissions("vendor"), deleteAProduct);

router
  .route("/products/:id/reviews")
  .get(authenticateUser, getSingleProductReviews);
module.exports = router;
