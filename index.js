require('dotenv').config();

const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/ExpressError.js");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
let port = 3000;
//-----------ejs mate-------------
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//ejs setup

app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));



//! requiring passport 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//!requiring listing router
const listingsRouter = require("./routes/listing.js");
//!requiring review router
const reviewsRouter = require("./routes/review.js");
//!requiring user router
const userRouter = require("./routes/user.js");

//connecting DATABASE(MONGODB)
let db_url = process.env.ATLASDB_URL;

async function main() {
    
    await mongoose.connect(db_url);

}

main().then((res) => {
    console.log("connected to DB");
}).catch((err) => { console.log(err) });

app.listen((port), () => {
    console.log("server is running");
});




//!express-session
const session = require("express-session");
const {MongoStore} =require("connect-mongo");

const store =MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.emv.SECRET,
    },    
    touchAfter:24*3600,

});    
store.on("error",()=>{
    console.log("error in MONGO STORE");
});    

app.use(session(
    {   
        store,
        secret: process.env.SECRET,
         resave: false, 
         saveUninitialized: true,
         cookie:{
            expires :new Date(Date.now()+1000*60*60*24*3), 
            maxAge:1000*60*60*24*3,
            httpOnly:true
         }   

    }     
));    

//!using connect flash
const flash = require("connect-flash");
app.use(flash());

//! configuring passport stragtegy
passport.initialize();
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//!requiring middleware for user authenticaion




//!flash middle ware
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser =req.user;
    next();
});




//! using listings routes
app.use("/listings", listingsRouter);

//!using review routes
app.use("/listings/:id/reviews", reviewsRouter);

//!using user routes
app.use("/", userRouter);



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;

    res.status(statusCode).render("listings/error.ejs", { message });
});

app.use("/", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

