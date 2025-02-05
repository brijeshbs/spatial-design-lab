import { useRef, useEffect } from "react";
import { Room, Component } from "./types";
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
  rotation: number;
  showPlot?: boolean;
  components: Component[];
}

export const RoomCanvas = ({
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  rotation,
  showPlot = false,
  components,
}: RoomCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 20;
    
    // Translate to create margin for dimensions
    ctx.save();
    ctx.translate(50, 50);
    
    if (showPlot) {
      drawPlotBorder(ctx, dimensions, gridSize);
      drawPlotDimensions(ctx, dimensions, gridSize);
    }

    // Draw rooms
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

    // Draw components
    components.forEach((component) => {
      ctx.save();
      
      // Move to component position and apply rotation
      ctx.translate(
        component.x + (component.width * gridSize) / 2,
        component.y + (component.length * gridSize) / 2
      );
      ctx.rotate((component.rotation * Math.PI) / 180);
      
      // Draw component
      ctx.fillStyle = "#9CA3AF";
      ctx.fillRect(
        -(component.width * gridSize) / 2,
        -(component.length * gridSize) / 2,
        component.width * gridSize,
        component.length * gridSize
      );
      
      // Add component label
      ctx.fillStyle = "#2C3E50";
      ctx.font = "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(
        component.type,
        0,
        0
      );
      
      ctx.restore();
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot, components]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        touchAction: 'none'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};