import { useRef, useEffect } from "react";
import { Room } from "./types";
import { Compass } from "./Compass";
import { ROOM_COLORS } from "./constants";
import { drawPlotBorder, drawPlotDimensions, drawRoomHandles } from "@/utils/canvasDrawing";

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

    canvas.width = Math.max(800, dimensions.width * 20 + 100);
    canvas.height = Math.max(600, dimensions.length * 20 + 100);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 20;
    
    drawPlotBorder(ctx, dimensions, gridSize);
    drawPlotDimensions(ctx, dimensions, gridSize);

    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      const roomColor = ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || "#E2E8F0";
      
      ctx.fillStyle = roomColor;
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );
      
      ctx.strokeStyle = isSelected ? "#3498DB" : "#2C3E50";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );

      ctx.fillStyle = "#2C3E50";
      ctx.font = "12px Inter";
      ctx.fillText(
        `${room.type} (${room.width}' × ${room.length}')`,
        room.x * gridSize + 5,
        room.y * gridSize + 20
      );

      if (isSelected) {
        drawRoomHandles(ctx, room, gridSize);
      }
    });

    const compass = new Compass({ 
      size: 60, 
      x: canvas.width - 80,
      y: canvas.height - 80
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