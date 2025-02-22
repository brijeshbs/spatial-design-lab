import { useRef, useEffect, useState } from "react";
import { Room, Component } from "./types";
import { drawPlotBorder, drawPlotDimensions, drawRoomHandles } from "@/utils/canvasDrawing";
import { drawRoom, drawRoomWindows, drawRoomDoors, drawRoomLabel } from "@/utils/canvasRoomUtils";
import { ComponentDrawer } from "./canvas/ComponentDrawer";
import { findClickedComponent, isValidDropPosition, isOverResizeHandle, calculateNewDimensions } from "./canvas/ComponentInteraction";
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
  onComponentResize?: (component: Component, newWidth: number, newLength: number) => void;
  onComponentDelete?: (component: Component) => void;
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
  onComponentResize,
  onComponentDelete,
}: RoomCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const draggedComponentRef = useRef<{ 
    component: Component; 
    offsetX: number; 
    offsetY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponent && onComponentDelete) {
        onComponentDelete(selectedComponent);
        setSelectedComponent(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, onComponentDelete]);

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

    // Draw resize handles for selected component
    if (selectedComponent) {
      ctx.save();
      ctx.translate(padding, padding);
      
      const handleSize = 8;
      const handles = [
        { x: selectedComponent.x, y: selectedComponent.y },
        { x: selectedComponent.x + (selectedComponent.width * gridSize), y: selectedComponent.y },
        { x: selectedComponent.x, y: selectedComponent.y + (selectedComponent.length * gridSize) },
        { x: selectedComponent.x + (selectedComponent.width * gridSize), 
          y: selectedComponent.y + (selectedComponent.length * gridSize) }
      ];

      handles.forEach(handle => {
        ctx.fillStyle = "#2196F3";
        ctx.fillRect(
          handle.x - handleSize/2,
          handle.y - handleSize/2,
          handleSize,
          handleSize
        );
      });

      ctx.restore();
    }
  }, [rooms, selectedRoom, dimensions, rotation, showPlot, components, selectedComponent]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const padding = 100;
    const x = e.clientX - rect.left - padding;
    const y = e.clientY - rect.top - padding;
    const gridSize = 20;

    if (selectedComponent) {
      const handle = isOverResizeHandle(x, y, selectedComponent, gridSize);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        return;
      }
    }

    const clickedComponent = findClickedComponent({ components, x, y, gridSize });

    if (clickedComponent) {
      setSelectedComponent(clickedComponent);
      draggedComponentRef.current = {
        component: clickedComponent,
        offsetX: x - clickedComponent.x,
        offsetY: y - clickedComponent.y,
        initialX: clickedComponent.x,
        initialY: clickedComponent.y
      };
      canvas.style.cursor = 'move';
    } else {
      setSelectedComponent(null);
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

    if (isResizing && selectedComponent && resizeHandle && onComponentResize) {
      const { width, length } = calculateNewDimensions(
        selectedComponent,
        resizeHandle,
        x,
        y,
        gridSize
      );

      // Validate new dimensions
      if (
        width > 0 && length > 0 &&
        width * gridSize <= dimensions.width * gridSize &&
        length * gridSize <= dimensions.length * gridSize
      ) {
        onComponentResize(selectedComponent, width, length);
      }
      return;
    }

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

      // Validate move
      if (isValidDropPosition(
        constrainedX,
        constrainedY,
        component.width * gridSize,
        component.length * gridSize,
        components,
        component
      )) {
        onComponentMove(component, constrainedX, constrainedY);
      }
    }

    // Update cursor based on hover
    if (selectedComponent) {
      const handle = isOverResizeHandle(x, y, selectedComponent, gridSize);
      if (handle) {
        canvas.style.cursor = handle === 'bottomRight' || handle === 'topLeft' 
          ? 'nwse-resize' 
          : 'nesw-resize';
        return;
      }
    }

    const hoveringComponent = findClickedComponent({ components, x, y, gridSize });
    canvas.style.cursor = hoveringComponent ? 'move' : 'default';

    onMouseMove(e);
  };

  const handleMouseUp = () => {
    const wasDragging = draggedComponentRef.current !== null;
    const wasResizing = isResizing;

    if (wasDragging && draggedComponentRef.current) {
      const { component, initialX, initialY } = draggedComponentRef.current;
      if (component.x !== initialX || component.y !== initialY) {
        toast({
          title: "Component Moved",
          description: `${component.type} moved to (${component.x}, ${component.y})`,
        });
      }
    }

    if (wasResizing) {
      toast({
        title: "Component Resized",
        description: "Component dimensions updated",
      });
    }

    draggedComponentRef.current = null;
    setIsResizing(false);
    setResizeHandle(null);
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
      onMouseUp={() => {
        handleMouseUp();
        onMouseUp();
      }}
      onMouseLeave={(e) => {
        handleMouseUp();
        onMouseLeave();
      }}
    />
  );
};
