const Listing = require("../models/listing.js");
module.exports.index=async (req, res) => {
  const allListing = await Listing.find({});
  return res.render("./listing/index.ejs", { allListing }); // Added return
}
module.exports.newListingForm=(req, res) => {

  return res.render("./listing/new.ejs"); // Added return
};
// module.exports.createNewListing=async (req, res, next) => {
//   const data = req.body.obj;
//   const url=req.file.path;
//   const fileName=req.file.filename;
//   console.log(url, " ", fileName)

//   // Transform image string to object
//   if (typeof data.image === 'string') {
//     data.image = {
//       url: data.image,
//       filename: ''
//     };
//   }

//   const newLis = new Listing(data);
//   newLis.owner=req.user._id;
//   await newLis.save();
//   req.flash("success", "New listing is inserted");
//   return res.redirect("/listings"); // Added return
// };
module.exports.createNewListing = async (req, res, next) => {
  const data = req.body.obj;

  if (req.file) {
    data.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
   


  const newLis = new Listing(data);
  newLis.owner = req.user._id;
  await newLis.save();

  req.flash("success", "New listing is inserted");
  return res.redirect("/listings");
};

module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},})
  .populate("owner");
  
  if (!data) {
    req.flash("error", "The listing you're searching for has been deleted");
    return res.redirect("/listings"); // Added return
  }
  
  
  return res.render("./listing/show.ejs", { data }); // Added return
};
module.exports.editListing=async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  
  if (!data) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings"); // Added return
  }
  
  return res.render("./listing/edit", { data }); // Added return
};
// module.exports.updateListing=async (req, res) => {
//   const { id } = req.params;
//   const updatedData = req.body.obj;
  
//   if (!updatedData) {
//     throw new ExpressError(400, "Send valid data");
//   }

//   // Check if image is a string, convert it to object
//   if (typeof updatedData.image === 'string') {
//     updatedData.image = {
//       url: updatedData.image,
//       filename: ''
//     };
//   }


//   await Listing.findByIdAndUpdate(id, updatedData);
//   req.flash("success", "Listing is updated");
//   return res.redirect(`/listings/${id}`); // Added return
// };
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // All text inputs (title, description, price, etc.)
  const updatedData = req.body.obj;

  if (!updatedData) {
    throw new ExpressError(400, "Send valid data");
  }

  // If file was uploaded, replace the image
  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await Listing.findByIdAndUpdate(id, updatedData, { new: true });
  req.flash("success", "Listing is updated");
  return res.redirect(`/listings/${id}`);
};



module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is deleted");
  return res.redirect("/listings"); // Added return
};