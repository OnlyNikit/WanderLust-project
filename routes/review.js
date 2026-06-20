const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema");
const{isLoggedIn,isAuthor,validateReviews} = require("../middleware.js");
const reviewController = require("../controller/review.js");





//! ADDING Reviews

router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.addReview));

//!DELETE REVIEWS
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;