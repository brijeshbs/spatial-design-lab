import { useRef, useEffect } from "react";
import { Room } from "./types";
import { drawPlotBorder, drawPlotDimensions } from "@/utils/canvasDrawing";
import { RoomDrawer } from "./canvas/RoomDrawer";
import { RoomHandles } from "./canvas/RoomHandles";
import { getResizeEdge } from "@/utils/roomInteractionUtils";

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
    
    ctx.save();
    ctx.translate(50, 50);
    
    if (showPlot) {
      drawPlotBorder(ctx, dimensions, gridSize);
      drawPlotDimensions(ctx, dimensions, gridSize);
    }

    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      RoomDrawer({ ctx, room, isSelected, gridSize, wallThickness });
      
      if (isSelected) {
        RoomHandles({ ctx, room, gridSize });
      }
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedRoom) {
      e.currentTarget.style.cursor = 'default';
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;
    const handleSize = 10;

    // Check if mouse is over the selected room
    const roomX = selectedRoom.x * gridSize;
    const roomY = selectedRoom.y * gridSize;
    const roomWidth = selectedRoom.width * gridSize;
    const roomLength = selectedRoom.length * gridSize;

    const isOverRoom = x >= roomX && x <= roomX + roomWidth && 
                      y >= roomY && y <= roomY + roomLength;

    if (isOverRoom) {
      const edge = getResizeEdge(x, y, selectedRoom, gridSize, handleSize);
      
      if (edge) {
        switch (edge) {
          case 'top':
          case 'bottom':
            e.currentTarget.style.cursor = 'ns-resize';
            break;
          case 'left':
          case 'right':
            e.currentTarget.style.cursor = 'ew-resize';
            break;
          case 'topLeft':
          case 'bottomRight':
            e.currentTarget.style.cursor = 'nwse-resize';
            break;
          case 'topRight':
          case 'bottomLeft':
            e.currentTarget.style.cursor = 'nesw-resize';
            break;
        }
      } else {
        e.currentTarget.style.cursor = 'move';
      }
    } else {
      e.currentTarget.style.cursor = 'default';
    }

    const adjustedEvent = { 
      ...e, 
      clientX: x, 
      clientY: y 
    } as React.MouseEvent<HTMLCanvasElement>;
    
    onMouseMove(adjustedEvent);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    onMouseDown({ ...e, clientX: x, clientY: y } as React.MouseEvent<HTMLCanvasElement>);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};