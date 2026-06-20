const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

// const { listingSchema, reviewSchema } = require("../schema");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
let { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
let listingController=require("../controller/listing.js");
//!requiring multer
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


//index route
router.get("/", wrapAsync(listingController.index));
 
//create and new Route

router.get("/new", isLoggedIn, listingController.renderNewForm );

// adding to the listing route
router.post("/", isLoggedIn,upload.single("listing[image][url]") , validateListing,wrapAsync(listingController.new));
//show route where all detail we return according to their id 

router.get("/:id", wrapAsync(listingController.show));

//update route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.toUpdate));

router.put("/:id", isLoggedIn, isOwner,upload.single("listing[image][url]") , validateListing, wrapAsync(listingController.updated));

//delete route

router.delete("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.delete));

module.exports = router;