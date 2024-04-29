const express = require("express");
const router = express.Router();
const {
  registerBusiness,
  getSingleBusiness,
  getAllBusinesses,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//register a new business
router.post(
  "/business/register",
  authenticateUser,
  authorizePermissions("vendor"),
  registerBusiness
);

//admin route to view all businesses
router
  .route("/business/view-all-businesses")
  .get(authenticateUser, authorizePermissions("admin"), getAllBusinesses);

//view a single business
router.route("/business/:id").get(authenticateUser, getSingleBusiness);

//update business details
router
  .route("/business/update-my-shop/:id")
  .put(authenticateUser, authorizePermissions("vendor"), updateBusiness);

//delete a business
router
  .route("/business/delete-my-shop/:id")
  .delete(
    authenticateUser,
    authorizePermissions("vendor", "admin"),
    deleteBusiness
  );

module.exports = router;
