const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//MIDDLEWARE(VALIDATION FOR SCHEMA)
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
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
})

//SHOW ROUTE 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // id = id.trim();
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing })
}))

//CREATE ROUTE
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // Manually fix the image format before saving
    newListing.image = { url: req.body.listing.image, filename: "listingimage" }
    await newListing.save();
    res.redirect("/listings");
}))



//EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id)
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

    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;

