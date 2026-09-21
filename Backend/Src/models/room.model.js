const mongoose=require('mongoose');

const roomSchema=new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    roomName: {
        type: String,
        required: true
    },
    owner:{
        type: String,
        ref: "User",
        required: true
    },
    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    language: {
        type: String,
        default: "javascript"
    },
    code:{
        type: String,
        default: ""
    }
},
 {
        timestamps: true
    }
);

const roomModel=mongoose.model("Room",roomSchema);
module.exports=roomModel;