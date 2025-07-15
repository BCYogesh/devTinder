const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    });

    io.on("connection", (socket) => {

        // Join chat
        socket.on("joinChat", ({ firstName, userId, targetUserId, }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(firstName + "Room ID" + roomId);
            socket.join(roomId)
        });

        // Send Message
        socket.on("sendMessage", ({ firstName, lastName, userId, targetUserId, text
        }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(firstName + " " + text);
            io.to(roomId).emit("messageReceived", { firstName, lastName, text });

        });
        socket.on("disconnect", () => { });
    });
}

module.exports = initializeSocket;