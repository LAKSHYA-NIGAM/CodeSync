const express=require('express');
const authmiddleware=require("../middleware/auth.middleware");
const roomcontrollers=require("../controllers/room.controllers");
const RateLimiter=require("../middleware/ratelimiter.middleware");

const route=express.Router();

route.post("/create",authmiddleware,roomcontrollers.createRoom);
route.post("/join",authmiddleware,roomcontrollers.joinRoom);
route.get("/:roomId",authmiddleware,RateLimiter,roomcontrollers.getRoom);
route.post("/leave",authmiddleware,roomcontrollers.leaveRoom);


module.exports=route;