import React, { useContext, useRef, useState } from "react";
import { WebSocketContext } from "./context/WebsocketContext";

const Canvas: React.FC = () => {
  const { users, rectangles, updateCursor, addRectangle, moveRectangle } =
    useContext(WebSocketContext);
  const [currPos, setCurrPos] = useState({});
  const [isRectDragOn, setIsRectDragOn] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateCursor(x, y);
  };

  const onDrawRectStart = (e) => {
    if (isRectDragOn) {
      return;
    }
    setCurrPos({ x: e.clientX, y: e.clientY });
  };

  const onDrawRectEnd = (e) => {
    if (isRectDragOn) {
      return;
    }
    const currBoundingRect = e.currentTarget.getBoundingClientRect();
    const width = Math.abs(e.clientX - currPos.x);
    const height = Math.abs(e.clientY - currPos.y);
    const currY = Math.min(currPos.y, e.clientY);
    const currX = Math.min(currPos.x, e.clientX);
    const x = currX - currBoundingRect.left;
    const y = currY - currBoundingRect.top;
    setCurrPos({});
    addRectangle({
      x,
      y,
      width,
      height,
    });
  };

  const handleRectDragStart = (e) => {
    e.stopPropagation()
    setIsRectDragOn(true);
  };

  const handleRectDragEnd = (e, currRectId: string) => {
    e.stopPropagation()
    const currBoundingRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - currBoundingRect.left;
    const y = e.clientY - currBoundingRect.top;
    moveRectangle(currRectId, x, y);
    setIsRectDragOn(false);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={onDrawRectStart}
      onMouseUp={onDrawRectEnd}
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
          draggable
          onDragStart={handleRectDragStart}
          onDragEnd={(e) => {
            handleRectDragEnd(e, rect.id);
          }}
        />
      ))}
    </div>
  );
};

export default Canvas;
