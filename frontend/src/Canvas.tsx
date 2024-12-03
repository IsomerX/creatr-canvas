import React, { useContext } from "react";
import { WebSocketContext } from "./context/WebsocketContext";

const Canvas: React.FC = () => {
  const { users, rectangles, updateCursor } = useContext(WebSocketContext);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateCursor(x, y);
  };

  return (
    <div
      className="relative w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {users.map((user) => (
        <div
          key={user.id}
          className="absolute pointer-events-none flex items-center gap-2"
          style={{
            left: user.cursorPosition.x,
            top: user.cursorPosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: user.color }}
          />
          <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
            {user.name}
          </span>
        </div>
      ))}

      {/* Render rectangles */}
      {rectangles.map((rect) => (
        <div
          key={rect.id}
          className="absolute border-2 border-blue-500"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
          }}
        />
      ))}
    </div>
  );
};

export default Canvas;
