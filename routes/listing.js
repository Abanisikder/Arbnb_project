
const express = require("express");
const router = express.Router({ mergeParams: true });
const warpasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserror.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListingCreate,validateListingUpdate}=require("../middleware.js");
const listingcontroller=require("../controlllers/listing.js");
const multer  = require('multer')
const{storage}=require("../cloudeConfig.js");
const upload = multer({ storage });


router.route("/")
.get(warpasync(listingcontroller.index))
// .post(isLoggedIn, upload.single('image'),validateListing, warpasync(listingcontroller.createNewListing));
router.route("/")
  .get(warpasync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.single('image'),   // multer handles file
    (req, res, next) => {
      if (req.file) {
        // manually add the image data into body so Joi can validate
        if (!req.body.obj) req.body.obj = {};
        req.body.obj.image = {
          url: req.file.path,
          filename: req.file.filename
        };
      }
      next();
    },
    validateListingCreate, 
    warpasync(listingcontroller.createNewListing)
  );




// New listing form
router.get("/new",isLoggedIn,warpasync(listingcontroller.newListingForm) );

router.route("/:id")
.get(warpasync(listingcontroller.showListing))
.put(isLoggedIn, isOwner,upload.single("image"),(req, res, next) => {
      if (req.file) {
        // manually add the image data into body so Joi can validate
        if (!req.body.obj) req.body.obj = {};
        req.body.obj.image = {
          url: req.file.path,
          filename: req.file.filename
        };
      }
      next();
    }, validateListingUpdate, warpasync(listingcontroller.updateListing))
.delete(isLoggedIn, warpasync(listingcontroller.destroyListing));

// Show listing

router.get("/:id/edit",isLoggedIn, warpasync(listingcontroller.editListing));



module.exports = router;