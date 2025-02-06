import { Room } from "../types";

interface RoomHandlesProps {
  ctx: CanvasRenderingContext2D;
  room: Room;
  gridSize: number;
}

export const RoomHandles = ({ ctx, room, gridSize }: RoomHandlesProps) => {
  const handleSize = 8;
  ctx.fillStyle = "#3498DB";
  
  // Draw corner handles
  const corners = [
    [0, 0], // top-left
    [room.width * gridSize, 0], // top-right
    [0, room.length * gridSize], // bottom-left
    [room.width * gridSize, room.length * gridSize], // bottom-right
  ];

  corners.forEach(([hx, hy]) => {
    ctx.fillRect(
      room.x * gridSize + hx - handleSize/2,
      room.y * gridSize + hy - handleSize/2,
      handleSize,
      handleSize
    );
  });

  // Draw resize arrows
  const arrowSize = 12;
  ctx.strokeStyle = "#3498DB";
  ctx.lineWidth = 2;

  // Bottom-right resize arrow
  const x = room.x * gridSize + room.width * gridSize;
  const y = room.y * gridSize + room.length * gridSize;
  
  ctx.beginPath();
  // Horizontal arrow
  ctx.moveTo(x - arrowSize, y);
  ctx.lineTo(x, y);
  ctx.moveTo(x, y);
  ctx.lineTo(x - 4, y - 4);
  ctx.moveTo(x, y);
  ctx.lineTo(x - 4, y + 4);
  
  // Vertical arrow
  ctx.moveTo(x, y - arrowSize);
  ctx.lineTo(x, y);
  ctx.moveTo(x, y);
  ctx.lineTo(x - 4, y - 4);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 4, y - 4);
  
  ctx.stroke();
};