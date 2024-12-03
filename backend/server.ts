import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

interface User {
  id: string;
  name: string;
  color: string;
  cursorPosition: { x: number; y: number };
}

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  userId: string;
}

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Update this with your frontend URL
    methods: ["GET", "POST"],
  },
});

// In-memory state
let users: User[] = [];
let rectangles: Rectangle[] = [];

// Generate random color
const getRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF3333"];
  return colors[Math.floor(Math.random() * colors.length)];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add new user
  const newUser: User = {
    id: socket.id,
    name: `User ${users.length + 1}`,
    color: getRandomColor(),
    cursorPosition: { x: 0, y: 0 },
  };
  users.push(newUser);

  // Send current state to new user
  socket.emit("init", { users, rectangles });

  // Broadcast new user to others
  socket.broadcast.emit("userJoined", newUser);

  // Handle cursor position updates
  socket.on("cursorMove", (position: { x: number; y: number }) => {
    const user = users.find((u) => u.id === socket.id);
    if (user) {
      user.cursorPosition = position;
      socket.broadcast.emit("cursorUpdated", { userId: socket.id, position });
    }
  });

  // Handle rectangle creation
  socket.on("addRectangle", (rectangle: Omit<Rectangle, "id" | "userId">) => {
    const newRectangle: Rectangle = {
      ...rectangle,
      id: Math.random().toString(36).substr(2, 9),
      userId: socket.id,
    };
    rectangles.push(newRectangle);
    io.emit("rectangleAdded", newRectangle);
  });

  // Handle rectangle movement
  socket.on(
    "moveRectangle",
    ({ id, x, y }: { id: string; x: number; y: number }) => {
      const rectangle = rectangles.find((r) => r.id === id);
      if (rectangle) {
        rectangle.x = x;
        rectangle.y = y;
        socket.broadcast.emit("rectangleMoved", { id, x, y });
      }
    },
  );

  // Handle disconnection
  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("userLeft", socket.id);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
