// if(process.env.NODE_ENV !="production")
// {
//   require('dotenv').config();
// }

// const express=require("express");
// const app=express();
// const path=require("path");
// const mongoose=require("mongoose");
// const methodOverride=require("method-override");
// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.static(path.join(__dirname,"public")));
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method")); // Note the quotes
// const Listing=require("./models/listing.js");
// const Review=require("./models/review.js");
// engine = require('ejs-mate'),
// app.engine('ejs', engine);
// const warpasync=require("./utils/wrapasync.js");
// const ExpressError=require("./utils/expresserror.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Joi = require('@hapi/joi');  // ✅ Correct
// const listings=require("./routes/listing.js");
// const reviews=require("./routes/review.js");
// const users=require("./routes/user.js");
// const flash=require("connect-flash");
// const session=require("express-session");
// const MongoStore = require('connect-mongo');
// const passport = require("passport");
// const LocalStrategy=require("passport-local");
// const User=require("./models/user.js");
// const atlas_url=process.env.ATLASDB_URL;
// const store=MongoStore.create({
//   mongoUrl:atlas_url,
//   crypto:{
//     secret:process.env.SECRET,
//   },
//   touchAfter:24*3600,
// });
// store.on("error",()=>{
//   console.log("Error in mongo session",err);
// })
// const sessionOption={
//     store,
//     secret:process.env.SECRET,
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//       expires:Date.now()+7*24*60*60*1000,
//       maxAge:7*24*60*60*1000,
//       httpOnly:true,
      
//     }

// };
// app.get("/",(req,res)=>{
//   res.send("home page");
// })
// app.use(session(sessionOption
// ));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use((req,res,next)=>{
//   res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.currUser=req.user;
//   next();
// })

// const local_db='mongodb://127.0.0.1:27017/wonderlust';

// main().then((res)=>{
//     console.log("Mongoose connection");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(atlas_url);


// }
// port=8080;
// app.listen(port,(req,res)=>{
//     console.log("server is running on port ",port);
// });

// app.use("/listings",listings);
// app.use("/listings/:id/reviews",reviews)
// app.use("/",users);










// app.use((err,req,res,next)=>{
// //  let{status=500,message="something went wrong"}=err;
//  res.render("./listing/error.ejs",{err});
// //  res.status(status).send(message);
// });
// // ✅ CORRECT - Add return statement
// // app.use((err, req, res, next) => {
// //   const { status = 500, message = "Something went wrong" } = err;
// //   return res.status(status).render("./listing/error.ejs", { err });
// // });
if(process.env.NODE_ENV !="production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const warpasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserror.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// App configuration
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Database connection
const atlas_url = process.env.ATLASDB_URL;
const local_db = 'mongodb://127.0.0.1:27017/wonderlust';

async function main() {
  try {
    await mongoose.connect(atlas_url);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
}

main();

// Session configuration
const store = MongoStore.create({
  mongoUrl: atlas_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongo session", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

// Middleware
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ ROOT ROUTE - Keep this early
app.get("/", (req, res) => {
  res.send("home page");
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// Error handling middleware
app.use((err, req, res, next) => {
  res.render("./listing/error.ejs", {err});
});

// ✅ CORRECT PORT HANDLING FOR RENDER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});