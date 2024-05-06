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

//admin route to view all products
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
module.exports = router;
