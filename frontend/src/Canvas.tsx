import React, { useContext, useRef, useState } from "react";
import { WebSocketContext } from "./context/WebsocketContext";
import { Rectangle } from "./App";

const Canvas: React.FC = () => {
    const { users, rectangles, updateCursor, addRectangle, moveRectangle } = useContext(WebSocketContext);
    const [mouseDragStart, setMouseDragStart] = useState(false)
    const [rectDragging, setRectDragging] = useState(false)

    const [initialCoor, setInitialCoor] = useState<any>({})
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateCursor(x, y);
    };

    const handleMouseEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMouseDragStart(false)
        if (rectDragging) return
        const endPoints = {
            x: e.clientX,
            y: e.clientY
        }
        const startCoor = {
            x: Math.min(endPoints.x, initialCoor.x),
            y: Math.min(endPoints.y, initialCoor.y),
        }
        const width = Math.abs(endPoints.x - initialCoor.x)
        const height = Math.abs(endPoints.y - initialCoor.y)
        console.log(startCoor, endPoints, initialCoor, width, height, containerRef, {
            x: startCoor.x - (containerRef.current?.offsetLeft || 0),
            y: startCoor.y - (containerRef.current?.offsetTop || 0),
            width,
            height
        });
        addRectangle({
            x: startCoor.x - (containerRef.current?.offsetLeft || 0),
            y: startCoor.y - (containerRef.current?.offsetTop || 0),
            width,
            height
        })
    }

    const handleMouseStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMouseDragStart(true)
        console.log("hi", e);

        setInitialCoor({
            x: e.clientX,
            y: e.clientY
        })
    }

    const rectDragStart = (rect: Rectangle, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        setRectDragging(true)
    }

    const rectDrag = (rect: Rectangle, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log("qwe");

        if (!rectDragging) return
        e.preventDefault()
        e.stopPropagation()
        const newX = e.clientX - (containerRef.current?.offsetLeft || 0)
        const newY = e.clientX - (containerRef.current?.offsetTop || 0)
        console.log(newX, newY, e.clientX, e.clientY);

        moveRectangle(rect.id, newX, newY)
    }

    const rectDragEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        setRectDragging(false)
    }

    return (
        <div
            className="relative w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseStart}
            ref={containerRef}
            // onDrag={handleMouseDrag}
            onMouseUp={handleMouseEnd}
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
                    onMouseDown={e => rectDragStart(rect, e)}
                    onMouseMove={e => rectDrag(rect, e)}
                    onMouseUp={rectDragEnd}
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
