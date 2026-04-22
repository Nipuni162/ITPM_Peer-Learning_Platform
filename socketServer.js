const { Server } = require("socket.io");

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ✅ JOIN ROOM (session-based)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // ✅ SEND MESSAGE
    socket.on("sendMessage", (data) => {
      const { roomId, message, sender } = data;

      io.to(roomId).emit("receiveMessage", {
        message,
        sender,
        timestamp: new Date(),
      });
    });

    // ✅ TYPING INDICATOR (BONUS 🔥)
    socket.on("typing", (roomId) => {
      socket.to(roomId).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;