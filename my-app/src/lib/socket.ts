// lib/socket.ts
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";

export function initializeSocketIO(server: NetServer) {
  const io = new SocketIOServer(server, {
    path: "/api/socketio",
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

  (global as any).io = io;
  return io;
}
