"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// TypeScript file
const express_1 = __importDefault(require("express")); // Import default dan tipe
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const app = (0, express_1.default)(); // Gunakan express() untuk membuat instance
const port = parseInt(process.env.PORT || "3000", 10);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5173/",
      "https://teztrizz.vercel.app",
      "https://teztrizz.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const rooms = new Map();
function getRoomBySocketId(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((player) => player.id === socketId)) {
      return room;
    }
  }
  return undefined;
}
io.on("connection", (socket) => {
  console.log("a user connected with id:", socket.id);
  // Handle player joining room
  socket.on("join-room", (username) => {
    // Find an available room or create a new one
    let room = Array.from(rooms.values()).find(
      (r) => r.status === "waiting" && r.players.length < 2
    );
    if (!room) {
      // Create a new room
      const roomId = (0, uuid_1.v4)();
      room = {
        id: roomId,
        players: [],
        status: "waiting",
      };
      rooms.set(roomId, room);
    }
    // Add player to the room
    const player = { id: socket.id, username };
    room.players.push(player);
    // Join the socket room
    socket.join(room.id);
    console.log(`Player ${username} joined room ${room.id}`);
    // Send room info to the player
    socket.emit("player-joined-room", { roomId: room.id, playerId: socket.id });
    // If room now has 2 players, start the game
    if (room.players.length === 2) {
      room.status = "playing";
      // Notify both players the game is starting
      io.to(room.id).emit("game-start", {
        players: room.players,
        currentTurn: room.players[0].id,
      });
    }
  });
  // Handle game-related events
  socket.on("move", (data) => {
    const room = getRoomBySocketId(socket.id);
    if (room) {
      // Broadcast the move to the other player in the room
      socket.to(room.id).emit("opponent-move", data);
    }
  });
  socket.on("rotate", (data) => {
    const room = getRoomBySocketId(socket.id);
    if (room) {
      // Broadcast the rotation to the other player in the room
      socket.to(room.id).emit("opponent-rotate", data);
    }
  });
  socket.on("game-over", (data) => {
    const room = getRoomBySocketId(socket.id);
    if (room) {
      // Broadcast game over to the other player in the room
      socket.to(room.id).emit("opponent-game-over", data);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected with id:", socket.id);
    // Find and remove the player from any room
    const room = getRoomBySocketId(socket.id);
    if (room) {
      room.players = room.players.filter((player) => player.id !== socket.id);
      // If room is now empty, remove it
      if (room.players.length === 0) {
        rooms.delete(room.id);
      } else {
        // Notify the other player that their opponent left
        socket.to(room.id).emit("opponent-left");
      }
    }
  });
});
app.get("/", (req, res) => {
  // Tambahkan tipe untuk req dan res
  res.send("Hello World!");
});
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
