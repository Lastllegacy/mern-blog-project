import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   text: {
      type: String,
      required: true,
   },
   tags: {
      type: Array,
      default: []
   },
   viewsCount: {
      type:Number,
      default: 0
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   imageUrl: String
}, {
   timestamps: true,
})

// A model is a class with which we construct documents
export default mongoose.model('Post', PostSchema)