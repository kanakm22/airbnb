const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError");
const Joi = require('joi');
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

// validation for individual fields.. joi 


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hii, I am root.");
})

//MIDDLEWARE(VALIDATION FOR SCHEMA)
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

//INDEX ROUTE
app.get("/listings",  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}))

//NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
})

//SHOW ROUTE 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // id = id.trim();
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing })
}))

//CREATE ROUTE
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // Manually fix the image format before saving
    newListing.image = { url: req.body.listing.image, filename: "listingimage" }
    await newListing.save();
    res.redirect("/listings");
}))



//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id)
    res.render("./listings/edit.ejs", { listing })
}));

//UPDATE ROUTE
// app.put("/listings/:id", async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// })

app.put("/listings/:id",validateListing,  wrapAsync(async (req, res) => {
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
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// REVIEWS POST ROUTE
app.post("/listings/:id/reviews", validateReview,wrapAsync( async (req,res) =>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();

     res.redirect(`/listings/${listing._id}`);
}));


// DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async(req,res) =>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))






// app.get("/testListing", async (req,res) =>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "by the beach",
//         price: 12000,
//         location: "goa",
//         country: "india",
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// })

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});




app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
})



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});