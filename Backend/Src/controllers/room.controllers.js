const crypto = require("crypto");
const roomModel = require("../models/room.model");

async function createRoom(req, res) {
    try {
        const { roomName, language } = req.body;

        const owner = req.user._id;

        const room = await roomModel.create({
            roomId: crypto.randomUUID(),
            roomName: roomName,
            owner: owner,
            members: [owner],
            language: language,
            code: ""
        });

        res.status(201).json({
            message: "Room created successfully",
            room: room
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function joinRoom(req, res){
    try{
        const {roomId}= req.body;
        if(!roomId){
            return res.status(400).json({
                message:"roomId are required"
            });
        }
        const userId=req.user._id;
        const room=await roomModel.findOne({
            roomId: roomId
        })
        if(!room){
            return res.status(404).json({
             "message":"Room not found"
            });
         }
         if(!room.members.includes(userId)){
            room.members.push(userId);
            await room.save();
         }
         res.status(200).json({
            "message":"room joined successfully"
         })
        }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getRoom(req,res){
    try{
        const {roomId}=req.params;
        const room=await roomModel.findOne({roomId:roomId}).populate("owner members", "username name email");
        if(!room){
            return res.status(404).json({
                message:"Room not found"
            })
        }
        return res.status(200).json({
            "message":"the following are the room details",
             room:room
        })

    }
    catch(error){
        console.log(error);
       res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function leaveRoom(req, res) {
    try{
        const { roomId } = req.body;
        const userId=req.user.id;
        if (!roomId) {
            return res.status(400).json({
                message: "roomId is required"
            });
        }
        const room= await roomModel.findOne({roomId:roomId});
        if(!room){
            return res.status(404).json({
                "message":"room not found"
            })
        }
        room.members=room.members.filter(
            member => !member.equals(userId)
        )
        await room.save();
        res.status(200).json({
            message: "Room left successfully"
        });
    }
    catch (error){
        console.log(error);
         res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createRoom,
    joinRoom,
    getRoom,
    leaveRoom
};