import express from "express";
import http from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", (message) => {
      socket.to(message.receiverId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
