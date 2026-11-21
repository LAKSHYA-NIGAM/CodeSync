const crypto = require("crypto");
const roomModel = require("../models/room.model");
const { validateCreateRoom, validateRoomId } = require("../validators/room.validator");

async function createRoom(req, res) {
    try {
        const validation = validateCreateRoom(req.body || {});
        if (!validation.isValid) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validation.errors
            });
        }

        const { roomName, language } = validation.sanitized;
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
        console.error("Create room error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function joinRoom(req, res) {
    try {
        const { roomId } = req.body || {};
        if (!validateRoomId(roomId)) {
            return res.status(400).json({
                message: "Valid roomId is required"
            });
        }

        const userId = req.user._id;
        const room = await roomModel.findOne({ roomId });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (!room.members.includes(userId)) {
            room.members.push(userId);
            await room.save();
        }

        res.status(200).json({
            message: "room joined successfully"
        });
    } catch (error) {
        console.error("Join room error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getRoomDetails(req, res) {
    try {
        const { roomId } = req.params;
        if (!validateRoomId(roomId)) {
            return res.status(400).json({
                message: "Valid roomId is required"
            });
        }

        const room = await roomModel.findOne({ roomId }).populate("members", "username email");
        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room details fetched successfully",
            room
        });
    } catch (error) {
        console.error("Get room details error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createRoom,
    joinRoom,
    getRoomDetails
};
