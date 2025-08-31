const express=require("express");
const router=express.Router({mergeParams:true});
const warpasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expresserror.js");
const Review=require("../models/review.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");
const { newReview } = require("../controlllers/review.js");
const reviewControllers=require("../controlllers/review.js");






router.post("/",isLoggedIn,validateReview, warpasync(reviewControllers.newReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, warpasync(reviewControllers.destroyReview));
module.exports=router;
