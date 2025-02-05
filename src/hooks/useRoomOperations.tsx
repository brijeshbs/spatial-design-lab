import { Room } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useRoomOperations = (dimensions: { width: number; length: number }) => {
  const handleRoomMove = (room: Room, newX: number, newY: number) => {
    // Ensure rooms stay within plot boundaries
    const boundedX = Math.max(0, Math.min(newX, dimensions.width - room.width));
    const boundedY = Math.max(0, Math.min(newY, dimensions.length - room.length));

    // If the room would go outside boundaries, show a warning
    if (newX !== boundedX || newY !== boundedY) {
      toast({
        title: "Room Position Constrained",
        description: "Rooms must stay within the plot boundaries",
        variant: "default"
      });
    }

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

    const minSize = 5; // Minimum room size

    // Calculate new dimensions based on resize edge
    switch (edge) {
      case 'right':
        newWidth = Math.max(minSize, Math.min(
          room.width + deltaX / gridSize,
          dimensions.width - room.x
        ));
        break;
      case 'bottom':
        newLength = Math.max(minSize, Math.min(
          room.length + deltaY / gridSize,
          dimensions.length - room.y
        ));
        break;
      case 'bottomRight':
        newWidth = Math.max(minSize, Math.min(
          room.width + deltaX / gridSize,
          dimensions.width - room.x
        ));
        newLength = Math.max(minSize, Math.min(
          room.length + deltaY / gridSize,
          dimensions.length - room.y
        ));
        break;
    }

    // If the room would exceed boundaries, show a warning
    if (
      newX + newWidth > dimensions.width ||
      newY + newLength > dimensions.length
    ) {
      toast({
        title: "Room Size Constrained",
        description: "Room dimensions must stay within plot boundaries",
        variant: "default"
      });
    }

    // Ensure room stays within plot boundaries
    newWidth = Math.min(newWidth, dimensions.width - newX);
    newLength = Math.min(newLength, dimensions.length - newY);
    newX = Math.max(0, Math.min(newX, dimensions.width - minSize));
    newY = Math.max(0, Math.min(newY, dimensions.length - minSize));

    return { ...room, width: newWidth, length: newLength, x: newX, y: newY };
  };

  return {
    handleRoomMove,
    handleRoomResize,
  };
};