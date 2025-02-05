import { useRef, useEffect } from "react";
import { Room } from "./types";
import { Compass } from "./Compass";
import { ROOM_COLORS } from "./constants";

interface RoomCanvasProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const RoomCanvas = ({
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: RoomCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = 20;
    
    // Draw plot border
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, dimensions.width * gridSize, dimensions.length * gridSize);
    
    // Draw plot dimensions
    ctx.fillStyle = "#2C3E50";
    ctx.font = "12px Inter";
    ctx.fillText(`${dimensions.width} ft`, dimensions.width * gridSize / 2 - 20, -5);
    ctx.fillText(`${dimensions.length} ft`, -25, dimensions.length * gridSize / 2);

    // Draw rooms
    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      const roomColor = ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || "#E2E8F0";
      
      // Draw room
      ctx.fillStyle = roomColor;
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );
      
      // Draw room border
      ctx.strokeStyle = isSelected ? "#3498DB" : "#2C3E50";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );

      // Draw room label and dimensions
      ctx.fillStyle = "#2C3E50";
      ctx.font = "12px Inter";
      ctx.fillText(
        `${room.type} (${room.width}' × ${room.length}')`,
        room.x * gridSize + 5,
        room.y * gridSize + 20
      );

      // Draw measurements
      ctx.fillText(
        `${room.width} ft`,
        room.x * gridSize + (room.width * gridSize / 2) - 15,
        room.y * gridSize - 5
      );
      ctx.fillText(
        `${room.length} ft`,
        room.x * gridSize - 25,
        room.y * gridSize + (room.length * gridSize / 2)
      );

      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = "#3498DB";
        
        // Draw resize handles
        const handlePositions = [
          [0, 0],                           // Top-left
          [room.width * gridSize, 0],       // Top-right
          [0, room.length * gridSize],      // Bottom-left
          [room.width * gridSize, room.length * gridSize], // Bottom-right
          [room.width * gridSize / 2, 0],                    // Top
          [room.width * gridSize, room.length * gridSize / 2], // Right
          [room.width * gridSize / 2, room.length * gridSize], // Bottom
          [0, room.length * gridSize / 2]                    // Left
        ];

        handlePositions.forEach(([hx, hy]) => {
          ctx.fillRect(
            room.x * gridSize + hx - handleSize/2,
            room.y * gridSize + hy - handleSize/2,
            handleSize,
            handleSize
          );
        });
      }
    });

    // Draw compass
    const compass = new Compass({ 
      size: 60, 
      x: canvas.width - 40, 
      y: canvas.height - 40 
    });
    compass.draw(ctx);

  }, [rooms, selectedRoom, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        touchAction: 'none'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};