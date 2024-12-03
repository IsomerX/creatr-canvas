import "./App.css";
import CollaborativeCanvas from "./CollaborativeCanvas";

export type User = {
  id: string;
  name: string;
  color: string;
  cursorPosition: { x: number; y: number };
};

export type Rectangle = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  userId: string;
};

function App() {
  return (
    <>
      <CollaborativeCanvas />
    </>
  );
}

export default App;
