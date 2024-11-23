import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { genTokenAndSetCookie } from "../config/jwt.config.js";
import cloudinary from "../utils/cloudinary.utils.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ code: 0, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        code: 0,
        message: "Password should be at least 6 characters long",
      });
    }
    // to check if the user already exists in the database
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ code: 0, message: "User already exists" });
    }
    // if the user does not exist in the database
    // we hash the password
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hash,
      role: role ? role : "user",
    });
    genTokenAndSetCookie(newUser._id, res, newUser.role);
    await newUser.save();
    return res.status(200).json({
      code: 1,
      message: "user saved successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "error in registerUser" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 0, message: "All fields are required" });
    }
    // check to see if the user exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ code: 0, message: "User not found" });
    }
    // check if the password matches
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).json({ code: 0, message: "Invalid password" });
    }
    // if password matches;
    genTokenAndSetCookie(user._id, res, user.role);
    return res.status(200).json({
      code: 1,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "error in loginUser" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("userToken", { path: "/" });
    res.clearCookie("adminToken", { path: "/" });
    res.setHeader("Clear-Site-Data", '"cookies"');
    return res.status(200).json({
      code: 1,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ code: 0, message: "Error in logout" });
  }
};

export const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);

    const passMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passMatch) {
      return res.status(401).json({ code: 0, message: "Invalid old password" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        code: 0,
        message: "New password cannot be same as old password",
      });
    }
    // hash the new password
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    return res
      .status(200)
      .json({ code: 1, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in resetPassword" });
  }
};

export const updateUserProfile = async(req,res)=>{
  const {profilePic} = req.body;
  const userId = req.user._id;
  try {
    if(!profilePic){
      return res.status(400).json({code: 0,message: "Profile picture is required"})
    }
    const updatedProfilePic = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: updatedProfilePic.secure_url},{new:true});
    res.status(200).json({code: 1,message: "Profile updated successfully",user:{
      id: updatedUser._id,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    }})
  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 0,msg: "error in update profile controller"})
  }
}

export const getUserProfile = async()=>{
  const {id} = req.params;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({code: 1,message: "Profile fetched successfully",user})
  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 0,msg: "error in get profile controller"})
  }
}