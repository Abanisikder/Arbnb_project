const express = require("express");
const router = express.Router({ mergeParams: true });
const User=require("../models/user.js");
const warpasync=require("../utils/wrapasync.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const userControllers=require("../controlllers/user.js");
router.route("/signup")
.get(userControllers.SignUpForm)
.post(warpasync(userControllers.signUp));

router.route("/login")
.get(userControllers.loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
   userControllers.login
);


router.get("/logout",userControllers.logOut);
module.exports=router;