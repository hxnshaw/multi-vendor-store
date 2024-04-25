const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/adminController");

router.post("/admins/signup", registerAdmin);

router.post("/admins/login", loginAdmin);

router.post("/admins/logout", logoutAdmin);

module.exports = router;
