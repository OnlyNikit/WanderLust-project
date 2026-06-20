const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn,saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

///!signup
router.get("/signup", userController.toSignUp);

router.post("/signup", wrapAsync(userController.signUp));


//!login

router.get("/login", userController.toLogin);

//? for authentication
const authenticate = passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
});

router.post("/login",saveRedirectUrl, authenticate, wrapAsync(userController.login));


router.get("/logout", userController.logout);

module.exports = router;