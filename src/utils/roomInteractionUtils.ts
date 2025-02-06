import { Room, ResizeHandle } from "@/components/playground/types";
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