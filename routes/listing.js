const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, saveRedirectUrl} = require("../middleware.js");
const listingController = require("../controllers/listing.js"); 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage: storage });
const axios = require("axios");

router
    .route("/")
    .get(

        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );


//new route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

router
.route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isOwner,
        isLoggedIn,
        wrapAsync(listingController.destroyListing)
    );

//edit
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;
