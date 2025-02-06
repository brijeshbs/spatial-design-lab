import { Room } from "../types";

interface RoomHandlesProps {
  ctx: CanvasRenderingContext2D;
  room: Room;
  gridSize: number;
}

export const RoomHandles = ({ ctx, room, gridSize }: RoomHandlesProps) => {
  const handleSize = 10;
  ctx.fillStyle = "#3498DB";
  
  // Draw corner handles
  const corners = [
    { x: 0, y: 0, cursor: 'nw-resize' }, // top-left
    { x: room.width * gridSize, y: 0, cursor: 'ne-resize' }, // top-right
    { x: 0, y: room.length * gridSize, cursor: 'sw-resize' }, // bottom-left
    { x: room.width * gridSize, y: room.length * gridSize, cursor: 'se-resize' }, // bottom-right
  ];

  corners.forEach(({ x, y }) => {
    ctx.fillRect(
      room.x * gridSize + x - handleSize/2,
      room.y * gridSize + y - handleSize/2,
      handleSize,
      handleSize
    );
  });

  // Draw edge handles
  const edges = [
    { x: room.width * gridSize / 2, y: 0, cursor: 'n-resize' }, // top
    { x: room.width * gridSize, y: room.length * gridSize / 2, cursor: 'e-resize' }, // right
    { x: room.width * gridSize / 2, y: room.length * gridSize, cursor: 's-resize' }, // bottom
    { x: 0, y: room.length * gridSize / 2, cursor: 'w-resize' }, // left
  ];

  edges.forEach(({ x, y }) => {
    ctx.fillRect(
      room.x * gridSize + x - handleSize/2,
      room.y * gridSize + y - handleSize/2,
      handleSize,
      handleSize
    );
  });
};