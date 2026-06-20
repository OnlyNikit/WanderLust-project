const Listing = require("../models/listing");



module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};
module.exports.new = async (req, res, next) => {
    if(!req.file){
      req.flash("error","Image required");
      return res.redirect("/listings/new");
   }

   
    let url = req.file.path;
    let filename= req.file.filename;
    let newListing = new Listing(req.body.listing)
    newListing.image={url,filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", " Successful:New Listing Created");
    res.redirect("/listings");

};

module.exports.show = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing is already deleted or not exist!")
        return res.redirect("/listings");
    }
    let orignialImageUrl=listing.image.url;
    originalImageUrl=orignialImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/show.ejs", { listing ,orignialImageUrl});
};

module.exports.toUpdate = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing is already deleted or not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });

};

module.exports.updated = async (req, res, next) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true ,new:true});

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;

    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success", " Listing is updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing is Deleted!");
    res.redirect("/listings");

};