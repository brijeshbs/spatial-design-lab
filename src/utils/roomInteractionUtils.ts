import { Room } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const handleRoomMove = (
  room: Room,
  newX: number,
  newY: number,
  dimensions: { width: number; length: number }
) => {
  // Ensure room stays within plot boundaries
  const constrainedX = Math.max(0, Math.min(newX, dimensions.width - room.width));
  const constrainedY = Math.max(0, Math.min(newY, dimensions.length - room.length));

  return { ...room, x: constrainedX, y: constrainedY };
};

export const handleRoomResize = (
  room: Room,
  deltaX: number,
  deltaY: number,
  edge: string,
  gridSize: number,
  dimensions: { width: number; length: number }
) => {
  const minSize = 5;
  let newWidth = room.width;
  let newLength = room.length;
  let newX = room.x;
  let newY = room.y;

  switch (edge) {
    case 'right':
      newWidth = Math.max(minSize, Math.min(
        room.width + Math.round(deltaX / gridSize),
        dimensions.width - room.x
      ));
      break;
    case 'bottom':
      newLength = Math.max(minSize, Math.min(
        room.length + Math.round(deltaY / gridSize),
        dimensions.length - room.y
      ));
      break;
    case 'bottomRight':
      newWidth = Math.max(minSize, Math.min(
        room.width + Math.round(deltaX / gridSize),
        dimensions.width - room.x
      ));
      newLength = Math.max(minSize, Math.min(
        room.length + Math.round(deltaY / gridSize),
        dimensions.length - room.y
      ));
      break;
  }

  return { ...room, width: newWidth, length: newLength, x: newX, y: newY };
};

export const getResizeEdge = (
  x: number,
  y: number,
  room: Room,
  gridSize: number,
  handleSize: number
): string | null => {
  const roomX = room.x * gridSize;
  const roomY = room.y * gridSize;
  const roomWidth = room.width * gridSize;
  const roomLength = room.length * gridSize;

  // Check corners first (they take precedence)
  const corners = [
    { x: roomX, y: roomY, edge: 'topLeft' },
    { x: roomX + roomWidth, y: roomY, edge: 'topRight' },
    { x: roomX, y: roomY + roomLength, edge: 'bottomLeft' },
    { x: roomX + roomWidth, y: roomY + roomLength, edge: 'bottomRight' },
  ];

  for (const corner of corners) {
    if (Math.abs(x - corner.x) <= handleSize && Math.abs(y - corner.y) <= handleSize) {
      return corner.edge;
    }
  }

  // Then check edges
  const edges = [
    { x: roomX + roomWidth / 2, y: roomY, edge: 'top' },
    { x: roomX + roomWidth, y: roomY + roomLength / 2, edge: 'right' },
    { x: roomX + roomWidth / 2, y: roomY + roomLength, edge: 'bottom' },
    { x: roomX, y: roomY + roomLength / 2, edge: 'left' },
  ];

  for (const edge of edges) {
    if (Math.abs(x - edge.x) <= handleSize && Math.abs(y - edge.y) <= handleSize) {
      return edge.edge;
    }
  }

  return null;
};
