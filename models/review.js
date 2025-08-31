const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'Comment is required'],  // Added validation
        trim: true  // Removes whitespace
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    createdAt: {  // Changed from createId to createdAt (more conventional)
        type: Date,
        default: Date.now  // Corrected (removed Date.now())
    },
    author:{
      type:Schema.Types.ObjectId,
        ref:"User",
    }
    
});

module.exports = mongoose.model("Review", reviewSchema);