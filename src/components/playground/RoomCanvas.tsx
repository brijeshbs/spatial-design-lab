import { useRef, useEffect } from "react";
import { Room, Component } from "./types";
import { drawPlotBorder, drawPlotDimensions, drawRoomHandles } from "@/utils/canvasDrawing";
import { drawRoom, drawRoomWindows, drawRoomDoors, drawRoomLabel } from "@/utils/canvasRoomUtils";
import { ComponentDrawer } from "./canvas/ComponentDrawer";
import { findClickedComponent } from "./canvas/ComponentInteraction";

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
  onComponentMove?: (component: Component, newX: number, newY: number) => void;
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
  onComponentMove,
}: RoomCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggedComponentRef = useRef<{ component: Component; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 20;
    const wallThickness = gridSize / 2;
    
    ctx.save();
    ctx.translate(50, 50);
    
    if (showPlot) {
      drawPlotBorder(ctx, dimensions, gridSize);
      drawPlotDimensions(ctx, dimensions, gridSize);
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
      ComponentDrawer({ ctx, component, gridSize });
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot, components]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    // Check for component click first
    const clickedComponent = findClickedComponent({ components, x, y, gridSize });

    if (clickedComponent) {
      draggedComponentRef.current = {
        component: clickedComponent,
        offsetX: x - clickedComponent.x,
        offsetY: y - clickedComponent.y
      };
      canvas.style.cursor = 'move';
    } else {
      // If no component was clicked, handle room selection
      onMouseDown(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    if (draggedComponentRef.current && onComponentMove) {
      const { component, offsetX, offsetY } = draggedComponentRef.current;
      const newX = Math.round((x - offsetX) / gridSize) * gridSize;
      const newY = Math.round((y - offsetY) / gridSize) * gridSize;
      onComponentMove(component, newX, newY);
    } else {
      onMouseMove(e);
    }

    // Update cursor based on what's being hovered
    if (selectedRoom) {
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;
      
      if (x >= roomX && x <= roomX + roomWidth && 
          y >= roomY && y <= roomY + roomLength) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={(e) => {
        draggedComponentRef.current = null;
        e.currentTarget.style.cursor = 'default';
        onMouseUp();
      }}
      onMouseLeave={(e) => {
        draggedComponentRef.current = null;
        e.currentTarget.style.cursor = 'default';
        onMouseLeave();
      }}
    />
  );
};