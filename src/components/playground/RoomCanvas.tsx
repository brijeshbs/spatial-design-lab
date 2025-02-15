import { useRef, useEffect } from "react";
import { Room, Component } from "./types";
import { drawPlotBorder, drawPlotDimensions, drawRoomHandles } from "@/utils/canvasDrawing";
import { drawRoom, drawRoomWindows, drawRoomDoors, drawRoomLabel } from "@/utils/canvasRoomUtils";
import { ComponentDrawer } from "./canvas/ComponentDrawer";
import { findClickedComponent } from "./canvas/ComponentInteraction";
import { toast } from "@/components/ui/use-toast";

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
  const draggedComponentRef = useRef<{ 
    component: Component; 
    offsetX: number; 
    offsetY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 100;
    const gridSize = 20;
    const wallThickness = gridSize / 2;

    // Calculate required canvas size based on plot dimensions and padding
    const requiredWidth = (dimensions.width * gridSize) + (padding * 2);
    const requiredHeight = (dimensions.length * gridSize) + (padding * 2);

    // Set canvas size to the larger of window size or required size
    canvas.width = Math.max(window.innerWidth, requiredWidth);
    canvas.height = Math.max(window.innerHeight, requiredHeight);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(padding, padding);
    
    if (showPlot) {
      ctx.strokeStyle = "#403E43";
      ctx.lineWidth = wallThickness;
      ctx.strokeRect(
        wallThickness / 2,
        wallThickness / 2,
        dimensions.width * gridSize - wallThickness,
        dimensions.length * gridSize - wallThickness
      );
      
      drawPlotDimensions(ctx, dimensions, gridSize);
      
      ctx.fillStyle = "#2C3E50";
      ctx.fillRect(
        dimensions.width * gridSize - (3 * gridSize),
        dimensions.length * gridSize - (gridSize / 2),
        3 * gridSize,
        gridSize / 2
      );
    }

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

    components.forEach((component) => {
      ComponentDrawer({ ctx, component, gridSize });
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot, components]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const padding = 100;
    const x = e.clientX - rect.left - padding;
    const y = e.clientY - rect.top - padding;
    const gridSize = 20;

    const clickedComponent = findClickedComponent({ components, x, y, gridSize });

    if (clickedComponent) {
      draggedComponentRef.current = {
        component: clickedComponent,
        offsetX: x - clickedComponent.x,
        offsetY: y - clickedComponent.y,
        initialX: clickedComponent.x,
        initialY: clickedComponent.y
      };
      canvas.style.cursor = 'move';
      
      // Visual feedback for component selection
      const ghost = document.createElement('div');
      ghost.className = 'fixed pointer-events-none border-2 border-blue-500 bg-blue-100/20 transition-all duration-75';
      ghost.style.width = `${clickedComponent.width * gridSize}px`;
      ghost.style.height = `${clickedComponent.length * gridSize}px`;
      ghost.style.transform = `translate(${clickedComponent.x}px, ${clickedComponent.y}px)`;
      ghost.id = 'component-ghost';
      document.body.appendChild(ghost);
    } else {
      onMouseDown(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const padding = 100;
    const x = e.clientX - rect.left - padding;
    const y = e.clientY - rect.top - padding;
    const gridSize = 20;

    if (draggedComponentRef.current && onComponentMove) {
      const { component, offsetX, offsetY } = draggedComponentRef.current;
      
      // Snap to grid
      const newX = Math.round((x - offsetX) / gridSize) * gridSize;
      const newY = Math.round((y - offsetY) / gridSize) * gridSize;

      // Boundary validation
      const maxX = (dimensions.width * gridSize) - (component.width * gridSize);
      const maxY = (dimensions.length * gridSize) - (component.length * gridSize);
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // Update ghost position
      const ghost = document.getElementById('component-ghost');
      if (ghost) {
        ghost.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
      }

      // Check for collision with other components
      const hasCollision = components.some(other => {
        if (other.id === component.id) return false;
        
        return !(
          constrainedX + (component.width * gridSize) <= other.x ||
          constrainedX >= other.x + (other.width * gridSize) ||
          constrainedY + (component.length * gridSize) <= other.y ||
          constrainedY >= other.y + (other.length * gridSize)
        );
      });

      if (!hasCollision) {
        onComponentMove(component, constrainedX, constrainedY);
      }
      return;
    }

    const hoveredRoom = rooms.find(room => {
      const roomX = room.x * gridSize;
      const roomY = room.y * gridSize;
      const roomWidth = room.width * gridSize;
      const roomLength = room.length * gridSize;
      
      return x >= roomX && x <= roomX + roomWidth && 
             y >= roomY && y <= roomY + roomLength;
    });

    if (hoveredRoom && selectedRoom?.id === hoveredRoom.id) {
      if (isOverRoomHandle(x, y, hoveredRoom)) {
        canvas.style.cursor = 'nwse-resize';
      } else {
        canvas.style.cursor = 'move';
      }
    } else {
      const hoveringComponent = findClickedComponent({ components, x, y, gridSize });
      canvas.style.cursor = hoveringComponent ? 'move' : 'default';
    }

    onMouseMove(e);
  };

  const isOverRoomHandle = (x: number, y: number, room: Room): boolean => {
    const gridSize = 20;
    const handleSize = 8;
    const roomX = room.x * gridSize;
    const roomY = room.y * gridSize;
    const roomWidth = room.width * gridSize;
    const roomLength = room.length * gridSize;

    const nearRight = Math.abs(x - (roomX + roomWidth)) <= handleSize;
    const nearBottom = Math.abs(y - (roomY + roomLength)) <= handleSize;
    const nearLeft = Math.abs(x - roomX) <= handleSize;
    const nearTop = Math.abs(y - roomY) <= handleSize;

    return (nearRight && (nearTop || nearBottom)) || 
           (nearLeft && (nearTop || nearBottom)) ||
           (nearRight && y >= roomY && y <= roomY + roomLength) ||
           (nearLeft && y >= roomY && y <= roomY + roomLength) ||
           (nearTop && x >= roomX && x <= roomX + roomWidth) ||
           (nearBottom && x >= roomX && x <= roomX + roomWidth);
  };

  const cleanupDrag = () => {
    const ghost = document.getElementById('component-ghost');
    if (ghost) {
      ghost.remove();
    }
    
    if (draggedComponentRef.current) {
      const { component, initialX, initialY } = draggedComponentRef.current;
      const currentX = component.x;
      const currentY = component.y;
      
      if (currentX !== initialX || currentY !== initialY) {
        toast({
          title: "Component Moved",
          description: `${component.type} moved to (${currentX}, ${currentY})`,
        });
      }
    }
    
    draggedComponentRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ 
        touchAction: 'none',
        minHeight: `${(dimensions.length * 20) + 200}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'default';
        cleanupDrag();
        onMouseUp();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.cursor = 'default';
        cleanupDrag();
        onMouseLeave();
      }}
    />
  );
};
