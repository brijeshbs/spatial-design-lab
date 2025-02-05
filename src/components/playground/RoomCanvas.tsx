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
    const wallThickness = gridSize / 2; // Thickness for walls
    
    // Translate to create margin for dimensions
    ctx.save();
    ctx.translate(50, 50);
    
    if (showPlot) {
      // Draw plot walls (thicker border)
      ctx.strokeStyle = "#403E43"; // Wall color
      ctx.lineWidth = wallThickness;
      ctx.strokeRect(
        wallThickness / 2,
        wallThickness / 2,
        dimensions.width * gridSize - wallThickness,
        dimensions.length * gridSize - wallThickness
      );
      
      drawPlotDimensions(ctx, dimensions, gridSize);
      
      // Draw plot door
      const doorWidth = 3 * gridSize;
      const doorHeight = gridSize / 2;
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(
        dimensions.width * gridSize - doorWidth,
        dimensions.length * gridSize - doorHeight,
        doorWidth,
        doorHeight
      );
    }

    // Draw rooms
    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      const roomColor = ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || "#E2E8F0";
      
      // Draw room fill
      ctx.fillStyle = roomColor;
      ctx.fillRect(
        room.x * gridSize + wallThickness / 2,
        room.y * gridSize + wallThickness / 2,
        room.width * gridSize - wallThickness,
        room.length * gridSize - wallThickness
      );
      
      // Draw room walls (thicker border)
      ctx.strokeStyle = isSelected ? "#3498DB" : "#403E43";
      ctx.lineWidth = wallThickness;
      ctx.strokeRect(
        room.x * gridSize + wallThickness / 2,
        room.y * gridSize + wallThickness / 2,
        room.width * gridSize - wallThickness,
        room.length * gridSize - wallThickness
      );

      // Draw windows (on each wall except where the door is)
      const windowWidth = 3 * gridSize;
      const windowHeight = gridSize / 2;
      ctx.fillStyle = "#D3E4FD";

      // Top wall window
      ctx.fillRect(
        room.x * gridSize + (room.width * gridSize / 2) - (windowWidth / 2),
        room.y * gridSize,
        windowWidth,
        windowHeight
      );

      // Left wall window
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize + (room.length * gridSize / 2) - (windowWidth / 2),
        windowHeight,
        windowWidth
      );

      // Draw room door (except for Living Room)
      if (room.type !== "Living Room") {
        const doorWidth = 3 * gridSize;
        const doorHeight = gridSize / 2;
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(
          room.x * gridSize + room.width * gridSize - doorWidth,
          room.y * gridSize + room.length * gridSize - doorHeight,
          doorWidth,
          doorHeight
        );
      }

      // Draw Living Room door alongside plot door
      if (room.type === "Living Room") {
        const doorWidth = 3 * gridSize;
        const doorHeight = gridSize / 2;
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(
          dimensions.width * gridSize - doorWidth - (4 * gridSize), // Offset from plot door
          dimensions.length * gridSize - doorHeight,
          doorWidth,
          doorHeight
        );
      }

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
      style={{
        touchAction: 'none'
      }}
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