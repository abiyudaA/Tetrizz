// TypeScript file
import express, { Express, Request, Response } from "express"; // Import default dan tipe
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app: Express = express(); // Gunakan express() untuk membuat instance
const port = parseInt(process.env.PORT || '3000', 10);
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5173/", "https://teztrizbattle.vercel.app", "https://teztrizbattle.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

interface Player {
  id: string; // socket.id
  username: string;
}

interface Room {
  id: string;
  players: Player[];
  status: "waiting" | "playing";
}

const rooms: Map<string, Room> = new Map();

function getRoomBySocketId(socketId: string): Room | undefined {
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
  socket.on("join-room", (username: string) => {
    // Find an available room or create a new one
    let room = Array.from(rooms.values()).find(r => r.status === "waiting" && r.players.length < 2);
    
    if (!room) {
      // Create a new room
      const roomId = uuidv4();
      room = {
        id: roomId,
        players: [],
        status: "waiting"
      };
      rooms.set(roomId, room);
    }

    // Add player to the room
    const player: Player = { id: socket.id, username };
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
        currentTurn: room.players[0].id
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
      room.players = room.players.filter(player => player.id !== socket.id);
      
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

app.get("/", (req: Request, res: Response) => {
  // Tambahkan tipe untuk req dan res
  res.send("Hello World!");
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
