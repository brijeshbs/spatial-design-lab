import { useState, useCallback } from "react";
import { Room } from "./types";
import { RoomCanvas } from "./RoomCanvas";
import { InfiniteGrid } from "./InfiniteGrid";
import { Compass } from "./Compass";

interface CanvasAreaProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const CanvasArea = ({
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: CanvasAreaProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prevScale => Math.min(Math.max(0.1, prevScale * delta), 5));
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || e.button === 2) {
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else {
      onMouseDown(e);
    }
  }, [position, onMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPanPosition.x,
        y: e.clientY - startPanPosition.y,
      });
    } else {
      onMouseMove(e);
    }
  }, [isPanning, startPanPosition, onMouseMove]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    } else {
      onMouseUp();
    }
  }, [isPanning, onMouseUp]);

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <InfiniteGrid width={window.innerWidth} height={window.innerHeight} scale={scale} position={position} />
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={onMouseLeave}
          rotation={rotation}
        />
      </div>
      <div className="fixed bottom-8 right-8 z-50">
        <Compass size={60} rotation={rotation} onRotate={setRotation} />
      </div>
    </div>
  );
};