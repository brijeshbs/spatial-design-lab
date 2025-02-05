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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    // Check if clicking on a component
    const clickedComponent = components.find(component => {
      const componentX = component.x;
      const componentY = component.y;
      const componentWidth = component.width * gridSize;
      const componentLength = component.length * gridSize;

      return (
        x >= componentX &&
        x <= componentX + componentWidth &&
        y >= componentY &&
        y <= componentY + componentLength
      );
    });

    if (clickedComponent) {
      draggedComponentRef.current = {
        component: clickedComponent,
        offsetX: x - clickedComponent.x,
        offsetY: y - clickedComponent.y
      };
      canvas.style.cursor = 'move';
    } else {
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
      return;
    }

    // Check if hovering over a component
    const hoveringComponent = components.some(component => {
      const componentX = component.x;
      const componentY = component.y;
      const componentWidth = component.width * gridSize;
      const componentLength = component.length * gridSize;

      return (
        x >= componentX &&
        x <= componentX + componentWidth &&
        y >= componentY &&
        y <= componentY + componentLength
      );
    });

    if (hoveringComponent) {
      canvas.style.cursor = 'move';
    } else {
      canvas.style.cursor = 'default';
    }

    onMouseMove(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    draggedComponentRef.current = null;
    e.currentTarget.style.cursor = 'default';
    onMouseUp();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => {
        draggedComponentRef.current = null;
        e.currentTarget.style.cursor = 'default';
        onMouseLeave();
      }}
    />
  );
};