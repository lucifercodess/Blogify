import express from 'express';
import {  getUserProfile, loginUser, logoutUser, registerUser, resetPassword, updateUserProfile } from '../controllers/user.controller.js';
import { adminVerify, userVerify } from '../middlewares/ProtectRoute.middleware.js';
import { deleteBlog, deleteUser, getAllUsers } from '../controllers/admin.controller.js';


const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.put("/reset-password",userVerify,resetPassword);
router.get("/profile",userVerify,getUserProfile);
router.put("/update",userVerify,updateUserProfile);
router.get("/admin/getAllUsers",adminVerify,getAllUsers);
router.delete("/admin/deleteUser/:id",adminVerify,deleteUser);
router.delete("/admin/deleteBlog/:id",adminVerify,deleteBlog)


export default router;