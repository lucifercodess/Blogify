import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const userVerify = async(req,res,next)=>{
  const token = req.cookies.userToken;
  try {
    if(!token){
      return res.status(401).json({ code: 0, message: "no token" });
    }
    // now check the token
    const decoded = jwt.verify(token,process.env.JWT);
    if(!decoded){
      return res.status(401).json({ code: 0, message: "Unauthorized" });
    }
    // if the token is valid
    const user = await User.findById(decoded.userId);
    // we will mostly never reach this if!user code but still its better.
    if(!user){
      return res.status(401).json({ code: 0, message: "no user unauth" });
    }
    // we add the user data in the req.user body;
   
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in user verification" });
  }
}

export const adminVerify = async(req,res,next)=>{
  const token = req.cookies.adminToken;
  try {
    if(!token){
      return res.status(401).json({ code: 0, message: "Unauthorized" });
    }
    // now check the token
    const decoded = jwt.verify(token,process.env.JWT);
    if(!decoded){
      return res.status(401).json({ code: 0, message: "Unauthorized" });
    }
    // if the token is valid
    const user = await User.findById(decoded.userId);
    // we will mostly never reach this if!user code but still its better.
    if(!user){
      return res.status(401).json({ code: 0, message: "Unauthorized" });
    }
    // we add the user data in the req.user body;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, message: "Error in admin verification" });
  }
}