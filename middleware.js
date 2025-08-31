const Listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError = require("./utils/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const { listingUpdateSchema } = require('./schema');
module.exports.isLoggedIn=(req,res,next)=>{
      if(!req.isAuthenticated())
  {
    req.session.redirectUrl=req.originalUrl;
    req.flash("error"," You have to login for creating listing");
    return res.redirect("/login");
  }
  next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async(req,res,next)=>{
  const { id } = req.params;
    let person = await Listing.findById(id);
  if (!person.owner._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
// module.exports. validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(',');
//     throw new ExpressError(400, msg); // Fixed: pass msg instead of error object
//   }
//   next();
// };
module.exports.validateListing = (req, res, next) => {
  // Make sure multer uploaded the file
  if (!req.file) {
    throw new ExpressError(400, "Image is required");
  }

  // Add the file path to req.body so Joi validation can see it
  req.body.image = req.file.path; // or req.file.filename depending on your multer config

  // Now validate
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  next();
};
module.exports.validateListingCreate = (req, res, next) => {
  if (!req.file && (!req.body.obj || !req.body.obj.image)) {
    throw new ExpressError(400, "Image is required");
  }
  if (req.file) {
    if (!req.body.obj) req.body.obj = {};
    req.body.obj.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports.validateListingUpdate = (req, res, next) => {
  if (req.file) {
    if (!req.body.obj) req.body.obj = {};
    req.body.obj.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  const { error } = listingUpdateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  next();
};

module.exports. validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // ✅ use review schema
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id,  reviewId } = req.params;
  const review = await Review.findById(reviewId);
  
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
