const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review");
const listingSchema = new Schema({
    title:{
        type:String,
       
    },
    description:{
        type:String,
    },
//    
     image: {
    filename: { type: String },
    url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1754338785183-70cd3cce3d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2MHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
    price:{
        type:Number,
         required: true,
        default:0,

    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",

    },],
    owner:{
      type:Schema.Types.ObjectId,
        ref:"User",
    }
});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});


const Listing = mongoose.model("listing", listingSchema);
module.exports=Listing;
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//     },
//     description: {
//         type: String,
//     },
//     image: {  // Changed to simple string type
//         type: String,
//         default: 'https://images.unsplash.com/photo-1754338785183-70cd3cce3d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2MHx8fGVufDB8fHx8fA%3D%3D'
//     },
//     price: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     location: {
//         type: String,
//     },
//     country: {
//         type: String,
//     },
//     reviews: [{
//         type: Schema.Types.ObjectId,
//         ref: "Review",
//     }]
// });

// const Listing = mongoose.model("listing", listingSchema);
// module.exports = Listing;
