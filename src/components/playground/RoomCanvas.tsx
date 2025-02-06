import { useRef, useEffect } from "react";
import { Room } from "./types";
import { drawPlotBorder, drawPlotDimensions } from "@/utils/canvasDrawing";
import { RoomDrawer } from "./canvas/RoomDrawer";
import { RoomHandles } from "./canvas/RoomHandles";

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
      RoomDrawer({ ctx, room, isSelected, gridSize, wallThickness });
      
      if (isSelected) {
        RoomHandles({ ctx, room, gridSize });
      }
    });
    
    ctx.restore();
  }, [rooms, selectedRoom, dimensions, rotation, showPlot]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ touchAction: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};