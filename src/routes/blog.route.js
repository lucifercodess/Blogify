import express from 'express';
import { createBlog, deleteBlog, editBlog, getAllBlogs, getPostsBySpecificUser, getSingleBlog } from '../controllers/blog.controller.js';
import { userVerify } from '../middlewares/ProtectRoute.middleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();


router.post('/create',userVerify,upload.single('image'),createBlog);
router.put('/update/:id',userVerify,editBlog);
router.delete('/delete/:id',userVerify,deleteBlog);
router.get('/getAll',userVerify,getAllBlogs);
router.get('/getBlog/:id',userVerify,getSingleBlog);
router.get('/getBlogs/:id',userVerify,getPostsBySpecificUser);
export default router;