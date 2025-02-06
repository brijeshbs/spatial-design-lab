import { useState, useCallback } from "react";
import { Room, ResizeHandle } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useRoomInteractions = (dimensions: { width: number; length: number }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  const handleRoomResize = useCallback((
    room: Room,
    deltaX: number,
    deltaY: number,
    edge: string,
    gridSize: number
  ): Room => {
    let newWidth = room.width;
    let newLength = room.length;
    let newX = room.x;
    let newY = room.y;

    switch (edge) {
      case 'right':
        newWidth = Math.max(5, Math.min(room.width + deltaX, dimensions.width - room.x));
        break;
      case 'bottom':
        newLength = Math.max(5, Math.min(room.length + deltaY, dimensions.length - room.y));
        break;
      case 'left':
        const potentialWidth = Math.max(5, room.width - deltaX);
        if (room.x + deltaX >= 0) {
          newWidth = potentialWidth;
          newX = room.x + deltaX;
        }
        break;
      case 'top':
        const potentialLength = Math.max(5, room.length - deltaY);
        if (room.y + deltaY >= 0) {
          newLength = potentialLength;
          newY = room.y + deltaY;
        }
        break;
    }

    return { ...room, width: newWidth, length: newLength, x: newX, y: newY };
  }, [dimensions]);

  const handleRoomMove = useCallback((room: Room, newX: number, newY: number): Room => {
    const constrainedX = Math.max(0, Math.min(newX, dimensions.width - room.width));
    const constrainedY = Math.max(0, Math.min(newY, dimensions.length - room.length));
    
    return { ...room, x: constrainedX, y: constrainedY };
  }, [dimensions]);

  return {
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    dragOffset,
    setDragOffset,
    resizeHandle,
    setResizeHandle,
    handleRoomResize,
    handleRoomMove,
  };
};