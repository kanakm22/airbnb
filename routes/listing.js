const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

//INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}))

//NEW ROUTE
router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
})

//SHOW ROUTE 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // id = id.trim();
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing })
}))

//CREATE ROUTE
router.post("/", validateListing,isLoggedIn, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // Manually fix the image format before saving
    newListing.image = { url: req.body.listing.image, filename: "listingimage" }
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}))



//EDIT ROUTE
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("./listings/edit.ejs", { listing })
}));

//UPDATE ROUTE
// router.put("/:id", async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// })

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.body.listing.image !== "undefined") {
        let url = req.body.listing.image;
        let filename = "listingimage";
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success","Listing Updated");
    

    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;

