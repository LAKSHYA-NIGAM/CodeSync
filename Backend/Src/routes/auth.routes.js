const express=require('express');
const authController=require('../controllers/auth.controllers');
const authMiddleware=require('../middleware/auth.middleware');
const RateLimiter=require("../middleware/ratelimiter.middleware");
const route=express.Router();
route.post("/register",authController.registeruser);
route.post("/login",RateLimiter,authController.loginuser);
route.get("/me",authMiddleware,async(req,res)=>{
    res.status(200).json({
        message: "User profile retrieved successfully",
        user: req.user
    });
});

module.exports=route;