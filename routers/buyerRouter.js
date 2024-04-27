const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
  getAllBuyers,
  viewSingleBuyer,
  viewMyBuyerProfile,
  updateBuyerPassword,
  buyerForgotPassword,
  buyerResetPassword,
  updateBuyerDetails,
  deleteBuyerProfile,
  deleteBuyerProfileByAdmin,
} = require("../controllers/buyerController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

//create a new buyer account
router.post("/buyers/signup", registerBuyer);

//login buyer
router.post("/buyers/login", loginBuyer);

//logout buyer
router.post("/buyers/logout", logoutBuyer);

//buyer forgot password
router.post("/buyers/forgot-password", buyerForgotPassword);

//buyer reset password
router.post("/buyers/reset-password", buyerResetPassword);

//Admin route to view all registered buyers
router
  .route("/buyers/view-all-buyers")
  .get(authenticateUser, authorizePermissions("admin"), getAllBuyers);

//view buyer profile
router
  .route("/buyers/view-my-dashboard")
  .get(authenticateUser, authorizePermissions("buyer"), viewMyBuyerProfile);

//buyer route to update password
router
  .route("/buyers/view-my-dashboard/update-password")
  .put(authenticateUser, updateBuyerPassword);

//buyer route to update personal details
router
  .route("/buyers/view-my-dashboard/update-profile")
  .put(authenticateUser, updateBuyerDetails);

//delete buyer account
router
  .route("/buyers/view-my-dashboard/delete-account")
  .delete(
    authenticateUser,
    authorizePermissions("admin", "buyer"),
    deleteBuyerProfile
  );

//Admin route to delete buyer account
router
  .route("/buyers/find-buyer/delete-account/:id")
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    deleteBuyerProfileByAdmin
  );

//admin route to view a buyer's account
router
  .route("/buyers/find-buyer/:id")
  .get(authenticateUser, authorizePermissions("admin"), viewSingleBuyer);

module.exports = router;
