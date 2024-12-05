import React, { useContext, useState } from "react";
import { WebSocketContext } from "./context/WebsocketContext";

const Canvas: React.FC = () => {
  const { users, rectangles, updateCursor, addRectangle, moveRectangle } =
    useContext(WebSocketContext);

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateCursor(x, y);

    if (isDragging && startPosition) {
      moveRectangle("preview", x, y);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPosition({ x, y });
    setIsDragging(true);
    addRectangle({
      x,
      y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !startPosition) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = Math.abs(endX - startPosition.x);
    const height = Math.abs(endY - startPosition.y);

    const x = Math.min(startPosition.x, endX);
    const y = Math.min(startPosition.y, endY);

    addRectangle({
      x,
      y,
      width,
      height,
    });

    moveRectangle("preview", 0, 0); 
    setIsDragging(false);
    setStartPosition(null);
  };

  const handleRectangleDrag = (
    id: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.width / 2;
    const y = e.clientY - rect.height / 2;
    moveRectangle(id, x, y);
  };

  return (
    <div
      className="relative w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
          className="absolute border-2 border-blue-500 bg-blue-100"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
          }}
          draggable
          onDrag={(e) => handleRectangleDrag(rect.id, e)}
        />
      ))}
    </div>
  );
};

export default Canvas;
