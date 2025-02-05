import { Room } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useRoomOperations = (dimensions: { width: number; length: number }) => {
  const handleRoomMove = (room: Room, newX: number, newY: number) => {
    const boundedX = Math.max(0, Math.min(newX, dimensions.width - room.width));
    const boundedY = Math.max(0, Math.min(newY, dimensions.length - room.length));
    return { ...room, x: boundedX, y: boundedY };
  };

  const handleRoomResize = (
    room: Room,
    deltaX: number,
    deltaY: number,
    edge: string,
    gridSize: number
  ) => {
    let newWidth = room.width;
    let newLength = room.length;
    let newX = room.x;
    let newY = room.y;

    switch (edge) {
      case 'right':
        newWidth = Math.max(5, room.width + deltaX / gridSize);
        break;
      case 'bottom':
        newLength = Math.max(5, room.length + deltaY / gridSize);
        break;
      case 'bottomRight':
        newWidth = Math.max(5, room.width + deltaX / gridSize);
        newLength = Math.max(5, room.length + deltaY / gridSize);
        break;
    }

    newWidth = Math.min(newWidth, dimensions.width - newX);
    newLength = Math.min(newLength, dimensions.length - newY);
    newX = Math.max(0, Math.min(newX, dimensions.width - 5));
    newY = Math.max(0, Math.min(newY, dimensions.length - 5));

    return { ...room, width: newWidth, length: newLength, x: newX, y: newY };
  };

  return {
    handleRoomMove,
    handleRoomResize,
  };
};