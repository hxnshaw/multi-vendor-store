const express = require("express");
const router = express.Router();
const {
  registerVendor,
  loginVendor,
  logoutVendor,
  getAllVendors,
  viewSingleVendor,
  viewMyVendorProfile,
  updateVendorPassword,
  vendorForgotPassword,
  vendorResetPassword,
  updateVendorDetails,
  deleteVendorProfile,
  deleteVendorProfileByAdmin,
} = require("../controllers/VendorController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//create a new Vendor account
router.post("/vendors/signup", registerVendor);

//login Vendor
router.post("/vendors/login", loginVendor);

//logout Vendor
router.post("/vendors/logout", logoutVendor);

//Vendor forgot password
router.post("/vendors/forgot-password", vendorForgotPassword);

//Vendor reset password
router.post("/vendors/reset-password", vendorResetPassword);

//Admin route to view all registered Vendors
router
  .route("/vendors/view-all-vendors")
  .get(authenticateUser, authorizePermissions("admin"), getAllVendors);

//view Vendor profile
router
  .route("/vendors/view-my-dashboard")
  .get(authenticateUser, authorizePermissions("vendor"), viewMyVendorProfile);

//Vendor route to update password
router
  .route("/vendors/view-my-dashboard/update-password")
  .put(authenticateUser, updateVendorPassword);

//Vendor route to update personal details
router
  .route("/vendors/view-my-dashboard/update-profile")
  .put(authenticateUser, updateVendorDetails);

//delete Vendor account
router
  .route("/vendors/view-my-dashboard/delete-account")
  .delete(
    authenticateUser,
    authorizePermissions("admin", "vendor"),
    deleteVendorProfile
  );

//Admin route to delete Vendor account
router
  .route("/vendors/find-vendor/delete-account/:id")
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    deleteVendorProfileByAdmin
  );

//admin route to view a Vendor's account
router
  .route("/vendors/find-vendor/:id")
  .get(authenticateUser, viewSingleVendor);

module.exports = router;
