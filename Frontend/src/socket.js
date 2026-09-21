import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    autoConnect: true,
    auth: (cb) => {
        cb({
            token: localStorage.getItem("token")
        });
    }
});

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
});

socket.on("receive-message", (message) => {
    console.log("Received message:", message);
});

export function joinRoom(roomId) {
    console.log("FRONTEND JOINING ROOM:", roomId);

    if (socket.connected) {
        socket.emit("join-room", roomId);
    } else {
        socket.auth = { token: localStorage.getItem("token") };
        socket.connect();
        socket.once("connect", () => {
            console.log("Socket connected, joining room:", roomId);
            socket.emit("join-room", roomId);
        });
    }
}

export function sendMessage(roomId, message) {
    console.log("Sending message:", roomId, message);

    socket.emit("send-message", {
        roomId,
        message
    });
}
export function codeChange(roomId, code) {
    console.log("Sending code:", roomId, code);
    socket.emit("code-change", {
        roomId,
        code
    });
}

export default socket;