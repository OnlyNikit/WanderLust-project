const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

//review Schema


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
            set: (url) => {
                if (!url || url.trim() === "") {
                    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";
                }
                return url;
            },
        }

    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ], 
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

listingSchema.post("findOneAndDelete", async(listing)=>{
    console.log("middle ware running");
    if(listing){
         await Review.deleteMany({_id:{$in:listing.reviews}})
    }
    console.log("reviews deleted");
});
    
   

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

