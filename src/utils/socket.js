const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
}

const initializeSocket = (server) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "https://tinderfordevs.netlify.app"
    ];
    const io = socket(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        // Join chat
        socket.on("joinChat", ({ firstName, userId, targetUserId, }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId)
        });

        // Send Message
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text
        }) => {

            try {
                const roomId = getSecretRoomId(userId, targetUserId);

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();
                io.to(roomId).emit("messageReceived", { firstName, lastName, text });
            }
            catch (err) {
                console.log(err);
            }
        });
        socket.on("disconnect", () => { });
    });
}

module.exports = initializeSocket;