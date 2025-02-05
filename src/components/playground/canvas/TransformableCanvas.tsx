import { Room, Component } from "../types";
import { RoomCanvas } from "../RoomCanvas";

interface TransformableCanvasProps {
  scale: number;
  position: { x: number; y: number };
  rotation: number;
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  showPlot: boolean;
  components: Component[];
  onComponentMove: (component: Component, newX: number, newY: number) => void;
}

export const TransformableCanvas = ({
  scale,
  position,
  rotation,
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  showPlot,
  components,
  onComponentMove,
}: TransformableCanvasProps) => {
  return (
    <div 
      className="absolute inset-0"
      style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transformOrigin: "center",
      }}
    >
      <RoomCanvas
        rooms={rooms}
        selectedRoom={selectedRoom}
        dimensions={dimensions}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        rotation={rotation}
        showPlot={showPlot}
        components={components}
        onComponentMove={onComponentMove}
      />
    </div>
  );
};