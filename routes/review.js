const express = require("express");
const router = express.Router({mergeParams: true});
// for nested routes.. means child inherit parameters of parent routes.. (here reviews inherit from listings routes )
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

// REVIEWS POST ROUTE
router.post("/", validateReview,wrapAsync( async (req,res) =>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     req.flash("success","New Review Created");

     res.redirect(`/listings/${listing._id}`);
}));


// DELETE REVIEW ROUTE
router.delete("/:reviewId", wrapAsync( async(req,res) =>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
}))

module.exports = router;