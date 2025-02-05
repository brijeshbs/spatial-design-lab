import { Room } from "@/components/playground/types";

export const calculateNewDimensions = (
  room: Room,
  deltaX: number,
  deltaY: number,
  edge: string,
  gridSize: number,
  plotDimensions: { width: number; length: number }
) => {
  let newWidth = room.width;
  let newLength = room.length;
  const minSize = 5;

  switch (edge) {
    case 'right':
      newWidth = Math.max(minSize, Math.min(
        room.width + deltaX / gridSize,
        plotDimensions.width - room.x
      ));
      break;
    case 'bottom':
      newLength = Math.max(minSize, Math.min(
        room.length + deltaY / gridSize,
        plotDimensions.length - room.y
      ));
      break;
    case 'bottomRight':
      newWidth = Math.max(minSize, Math.min(
        room.width + deltaX / gridSize,
        plotDimensions.width - room.x
      ));
      newLength = Math.max(minSize, Math.min(
        room.length + deltaY / gridSize,
        plotDimensions.length - room.y
      ));
      break;
  }

  return { newWidth, newLength };
};

export const constrainRoomPosition = (
  x: number,
  y: number,
  width: number,
  length: number,
  plotDimensions: { width: number; length: number }
) => {
  const minSize = 5;
  const newX = Math.max(0, Math.min(x, plotDimensions.width - minSize));
  const newY = Math.max(0, Math.min(y, plotDimensions.length - minSize));
  
  return {
    x: newX,
    y: newY,
    width: Math.min(width, plotDimensions.width - newX),
    length: Math.min(length, plotDimensions.length - newY)
  };
};