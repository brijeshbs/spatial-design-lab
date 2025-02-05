import { Room } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";
import { calculateNewDimensions, constrainRoomPosition } from "@/utils/roomOperations";

export const useRoomOperations = (dimensions: { width: number; length: number }) => {
  const handleRoomMove = (room: Room, newX: number, newY: number) => {
    const { x, y, width, length } = constrainRoomPosition(
      newX,
      newY,
      room.width,
      room.length,
      dimensions
    );

    if (newX !== x || newY !== y) {
      toast({
        title: "Room Position Constrained",
        description: "Rooms must stay within the plot boundaries",
        variant: "default"
      });
    }

    return { ...room, x, y, width, length };
  };

  const handleRoomResize = (
    room: Room,
    deltaX: number,
    deltaY: number,
    edge: string,
    gridSize: number
  ) => {
    const { newWidth, newLength } = calculateNewDimensions(
      room,
      deltaX,
      deltaY,
      edge,
      gridSize,
      dimensions
    );

    const { x, y, width, length } = constrainRoomPosition(
      room.x,
      room.y,
      newWidth,
      newLength,
      dimensions
    );

    if (width !== newWidth || length !== newLength) {
      toast({
        title: "Room Size Constrained",
        description: "Room dimensions must stay within plot boundaries",
        variant: "default"
      });
    }

    return { ...room, width, length, x, y };
  };

  return {
    handleRoomMove,
    handleRoomResize,
  };
};