import mongoose from "mongoose";

// blog schema
const blogSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  content:{
    type: String,
    required: true,
    maxlength: 5000,
  },
  author:{
    type: mongoose.Schema.Types.ObjectId, // will refer to the user.
    ref: "User",
    required: true,
  },
  image:{
    type: String,
    default: "",
  }
},{timestamps:true});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;