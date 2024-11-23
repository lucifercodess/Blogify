import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.utils.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ code: 0, message: "Title and content are required" });
    }

    let imageUrl = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image.path);

      if (!result) {
        return res
          .status(400)
          .json({ code: 0, message: "Error in uploading image to Cloudinary" });
      }

      imageUrl = result.secure_url;
    }

    const blog = new Blog({
      title,
      content,
      author: req.user._id, // Assuming you're storing user ID in the token
      image: imageUrl, // Store the Cloudinary URL of the image
    });

    // Save the blog post to the database
    await blog.save();

    // Return success response
    res.status(201).json({
      code: 1,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in creating blog" });
  }
};

export const editBlog = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;
  const { id } = req.params;
  const userId = req.user._id;
  try {
    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ code: 0, message: "Blog not found" });
    }
    if (blog.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ code: 0, message: "You are not authorized to edit this blog" });
    }
    if (title) {
      blog.title = title;
    }
    if (content) {
      blog.content = content;
    }

    if (image) {
      const result = await cloudinary.uploader.upload(image.path);

      if (!result) {
        return res
          .status(400)
          .json({ code: 0, message: "Error in uploading image to Cloudinary" });
      }

      // Update the blog image URL
      blog.image = result.secure_url; // Assign the uploaded image URL to the blog object
    }

    await blog.save();
    res
      .status(200)
      .json({ code: 1, message: "Blog updated successfully", blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in updating blog" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ code: 0, message: "Blog not found" });
    }
    console.log("author id: ", blog.author);
    console.log("user id: ", userId);
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({
        code: 0,
        message: "You are not authorized to delete this blog",
      });
    }
    await blog.deleteOne();
    res.status(200).json({ code: 1, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in deleting blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ code: 1, blogs });
  } catch (error) {
    return res.status(500).json({ code: 0, message: "error in getall blogs" });
  }
};

export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ code: 0, message: "Blog not found" });
    }
    res.status(200).json({ code: 1, blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in getting blog" });
  }
};

export const getPostsBySpecificUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    const blogs = await Blog.find({ author: id });
    return res.status(200).json({ code: 1, message: "blogs fetched", blogs });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in getting blogs by specific user" });
  }
};
