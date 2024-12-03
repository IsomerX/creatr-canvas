import { createContext, useEffect, useState } from "react";
import type { User, Rectangle } from "../App";
import { io, Socket } from "socket.io-client";

export const WebSocketContext = createContext<{
  socket: Socket | null;
  users: User[];
  rectangles: Rectangle[];
  updateCursor: (x: number, y: number) => void;
  addRectangle: (rect: Omit<Rectangle, "id" | "userId">) => void;
  moveRectangle: (id: string, x: number, y: number) => void;
}>({
  socket: null,
  users: [],
  rectangles: [],
  updateCursor: () => {},
  addRectangle: () => {},
  moveRectangle: () => {},
});

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.on("init", ({ users, rectangles }) => {
      setUsers(users);
      setRectangles(rectangles);
    });

    newSocket.on("userJoined", (user: User) => {
      setUsers((prev) => [...prev, user]);
    });

    newSocket.on("userLeft", (userId: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    });

    newSocket.on("cursorUpdated", ({ userId, position }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, cursorPosition: position } : user,
        ),
      );
    });

    newSocket.on("rectangleAdded", (rectangle: Rectangle) => {
      setRectangles((prev) => [...prev, rectangle]);
    });

    newSocket.on("rectangleMoved", ({ id, x, y }) => {
      setRectangles((prev) =>
        prev.map((rect) => (rect.id === id ? { ...rect, x, y } : rect)),
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const updateCursor = (x: number, y: number) => {
    if (socket) {
      socket.emit("cursorMove", { x, y });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === socket.id ? { ...user, cursorPosition: { x, y } } : user,
        ),
      );
    }
  };

  const addRectangle = (rect: Omit<Rectangle, "id" | "userId">) => {
    if (socket) {
      socket.emit("addRectangle", rect);
    }
  };

  const moveRectangle = (id: string, x: number, y: number) => {
    if (socket) {
      socket.emit("moveRectangle", { id, x, y });
      setRectangles((prev) =>
        prev.map((rect) => (rect.id === id ? { ...rect, x, y } : rect)),
      );
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        users,
        rectangles,
        updateCursor,
        addRectangle,
        moveRectangle,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
