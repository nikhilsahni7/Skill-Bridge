import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
    path: "/api/socketio",
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};
