require('dotenv').config();
const app=require("./Src/app");
const http=require("http");
const jwt=require("jsonwebtoken");
const userModel=require("./Src/models/user.model");
const connectDB=require("./Src/DB/db");
const redis=require("./Src/DB/redis");
connectDB();
const { Server } = require("socket.io");
const server=http.createServer(app);
const io = new Server(server, {
    cors: { 
        origin: "*"
    }
});
io.use(async (socket, next) => {

    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(
                new Error("Authentication token required")
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(
            decoded.userId
        );

        if (!user) {
            return next(
                new Error("User not found")
            );
        }

        socket.user = user;

        next();

    } catch (error) {

        next(
            new Error("Invalid or expired token")
        );

    }

});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.onAny((event, ...args) => {
    console.log("EVENT RECEIVED:", event, args);
});
    socket.on("join-room", (roomId) => {

    socket.join(roomId);

    console.log(
        "JOINED ROOM:",
        socket.id,
        roomId,
        Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    );
});

    socket.on("send-message", ({ roomId, message }) => {
    console.log("Message received:", message);

    socket.to(roomId).emit("receive-message",{username: socket.user.username,message: message});
});
socket.on("code-change", ({ roomId, code }) => {
    console.log("Code changed:", code);
    socket.to(roomId).emit("code-change", code);
});

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports={redis};