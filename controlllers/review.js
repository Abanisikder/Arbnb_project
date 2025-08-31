const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.newReview=async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  let newreview=new Review(req.body.review);
  newreview.author=req.user._id;

  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();
   req.flash("success","new Review is inserted");
res.redirect(`/listings/${req.params.id}`);


};
module.exports.destroyReview=async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review itself
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review is deleted");

  res.redirect(`/listings/${id}`);
};