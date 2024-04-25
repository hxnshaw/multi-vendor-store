const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getSingleAdmin,
  getAllAdmins,
  viewMyAdminProfile,
  updateAdminPassword,
} = require("../controllers/adminController");

router.post("/admins/signup", registerAdmin);

router.post("/admins/login", loginAdmin);

router.post("/admins/logout", logoutAdmin);

//view admin profile
router
  .route("/admins/my-admin-dashboard")
  .get(authenticateUser, authorizePermissions("admin"), viewMyAdminProfile);

//update admin password
router
  .route("/admins/my-admin-dashboard/update-password")
  .put(authenticateUser, authorizePermissions("admin"), updateAdminPassword);

//view all admins
router
  .route("/admins/view-all-admins")
  .get(authenticateUser, authorizePermissions("admin"), getAllAdmins);

//view each admin
router
  .route("/admins/:id")
  .get(authenticateUser, authorizePermissions("admin"), getSingleAdmin);

module.exports = router;
