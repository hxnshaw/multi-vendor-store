const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

//create a review
router
  .route("/reviews/create-review")
  .post(authenticateUser, authorizePermissions("buyer"), createReview);

//admin route to view all reviews
router
  .route("/reviews/all-reviews")
  .get(authenticateUser, authorizePermissions("admin"), getAllReviews);

//view a single review
router.route("/reviews/:id").get(authenticateUser, getSingleReview);

//update a review
router
  .route("/reviews/:id/update")
  .put(authenticateUser, authorizePermissions("buyer"), updateReview);

//delete a review
router
  .route("/reviews/:id/delete")
  .delete(authenticateUser, authorizePermissions("buyer"), deleteReview);

module.exports = router;
