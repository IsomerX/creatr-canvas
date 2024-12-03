import { Users, Move } from "lucide-react";
import WebSocketProvider from "./context/WebsocketContext";
import Canvas from "./Canvas";

const CollaborativeCanvas = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Collaborative Canvas</h1>
        <p className="text-gray-600">
          Build a collaborative canvas where users can see each other's cursors
          and create/move rectangles.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Online Users: 2</span>
          </div>
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            <span>Drag to create/move rectangles</span>
          </div>
        </div>

        <WebSocketProvider>
          <Canvas />
        </WebSocketProvider>
      </div>
    </div>
  );
};

export default CollaborativeCanvas;
