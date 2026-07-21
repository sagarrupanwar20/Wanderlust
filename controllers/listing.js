const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/show.ejs",{listing});
    }
    // console.log(listing);
    
};

module.exports.createListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);

    // Geocoding
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(newlisting.location)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "Wanderlust"
            }
        }
    );

    const data = await response.json();

    if (data.length > 0) {
        newlisting.geometry = {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
        };
    }

    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    await newlisting.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{ listing , originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    };
    req.flash("success","Listing Uptdated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   req.flash("success","listing Deleted");
   res.redirect("/listings");
};

