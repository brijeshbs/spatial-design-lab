import { useRef, useEffect } from "react";
import { Room, Component } from "./types";
import { ROOM_COLORS } from "./constants";
import { drawPlotBorder, drawPlotDimensions, drawRoomHandles } from "@/utils/canvasDrawing";
import { drawRoom, drawRoomWindows, drawRoomDoors, drawRoomLabel } from "@/utils/canvasRoomUtils";

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
    const wallThickness = gridSize / 2;
    
    // Translate to create margin for dimensions
    ctx.save();
    ctx.translate(50, 50);
    
    if (showPlot) {
      // Draw plot walls
      ctx.strokeStyle = "#403E43";
      ctx.lineWidth = wallThickness;
      ctx.strokeRect(
        wallThickness / 2,
        wallThickness / 2,
        dimensions.width * gridSize - wallThickness,
        dimensions.length * gridSize - wallThickness
      );
      
      drawPlotDimensions(ctx, dimensions, gridSize);
      
      // Draw plot door
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(
        dimensions.width * gridSize - (3 * gridSize),
        dimensions.length * gridSize - (gridSize / 2),
        3 * gridSize,
        gridSize / 2
      );
    }

    // Draw rooms
    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      
      drawRoom(ctx, room, isSelected, gridSize, wallThickness);
      drawRoomWindows(ctx, room, gridSize);
      drawRoomDoors(ctx, room, dimensions, gridSize);
      drawRoomLabel(ctx, room, gridSize);

      if (isSelected) {
        drawRoomHandles(ctx, room, gridSize);
      }
    });

    // Draw components
    components.forEach((component) => {
      ctx.save();
      
      ctx.translate(
        component.x + (component.width * gridSize) / 2,
        component.y + (component.length * gridSize) / 2
      );
      ctx.rotate((component.rotation * Math.PI) / 180);
      
      ctx.fillStyle = "#9CA3AF";
      ctx.fillRect(
        -(component.width * gridSize) / 2,
        -(component.length * gridSize) / 2,
        component.width * gridSize,
        component.length * gridSize
      );
      
      ctx.fillStyle = "#2C3E50";
      ctx.font = "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(component.type, 0, 0);
      
      ctx.restore();
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot, components]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    if (selectedRoom) {
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;
      const handleSize = 8;

      // Check if near edges
      const nearLeftEdge = Math.abs(x - roomX) <= handleSize;
      const nearRightEdge = Math.abs(x - (roomX + roomWidth)) <= handleSize;
      const nearTopEdge = Math.abs(y - roomY) <= handleSize;
      const nearBottomEdge = Math.abs(y - (roomY + roomLength)) <= handleSize;

      // Set cursor based on position
      if ((nearLeftEdge && nearTopEdge) || (nearRightEdge && nearBottomEdge)) {
        canvas.style.cursor = 'nwse-resize';
      } else if ((nearRightEdge && nearTopEdge) || (nearLeftEdge && nearBottomEdge)) {
        canvas.style.cursor = 'nesw-resize';
      } else if (nearLeftEdge || nearRightEdge) {
        canvas.style.cursor = 'ew-resize';
      } else if (nearTopEdge || nearBottomEdge) {
        canvas.style.cursor = 'ns-resize';
      } else if (x >= roomX && x <= roomX + roomWidth && y >= roomY && y <= roomY + roomLength) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    }

    onMouseMove(e);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'default';
        onMouseUp();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = 'default';
        onMouseLeave();
      }}
    />
  );
};