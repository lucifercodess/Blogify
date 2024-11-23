import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";


export const getAllUsers = async(req,res)=>{
  const adminId = req.user._id;
  try {
    const users = await User.find({_id:{$ne: adminId}}).select("-password");
    return res.status(200).json({ code: 1, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in getting users" });
  }
}

export const deleteUser = async(req,res)=>{
  const adminId = req.user._id;
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    if(!user){
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    if(user._id.toString() === adminId){
      return res.status(403).json({ code: 0, message: "You can't delete yourself" });
    }
    await user.deleteOne();
    return res.status(200).json({ code: 1, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in deleting user" });
  }
}

export const deleteBlog = async(req,res)=>{
  const {id} = req.params;
  try {
    const blog = await Blog.findById(id);
    if(!blog){
      return res.status(404).json({ code: 0, message: "Blog not found" });
    }
    await blog.deleteOne();
    return res.status(200).json({ code: 1, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in deleting blog" });
  }
}