const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const emailQueue=require("../Queue/email.queue");
async function registeruser(req,res){
    const { username, name, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email, and password are required",
            status: "failed"
        });
    }
    const isExist=await userModel.findOne({
        email:email
    });
    if(isExist){
        return res.status(422).json({
            message:"email already exist",
            status:"failed"
        })
    }
    const user=await userModel.create({
        username:username,
        name:name,
        email:email,
        password:password
    });
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token);
    res.status(201).json({
        message:"user registered successfully",
        status:"success",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        },token
    })
}
async function loginuser(req,res){
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
            status: "failed"
        });
    }
    const user = await userModel
        .findOne({ email })
        .select("+password");
    if(!user){
        return res.status(422).json({
            message:"email or password is invalid"
        })
    }
    const isvaliduser=await user.comparePassword(password);
    if(!isvaliduser){
        return res.status(422).json({
           message:"email or password is invalid" 
        })
    }
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token);
    res.status(200).send({
        user:{user:user._id,
        email:user.email},
        token
    })
}

module.exports={registeruser,loginuser};