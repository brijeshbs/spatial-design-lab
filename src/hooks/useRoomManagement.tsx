import { useState } from "react";
import { Room, ResizeHandle } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useRoomManagement = (dimensions: { width: number; length: number }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleRoomMove = (newX: number, newY: number) => {
    if (!selectedRoom) return;

    const boundedX = Math.max(0, Math.min(newX, dimensions.width - selectedRoom.width));
    const boundedY = Math.max(0, Math.min(newY, dimensions.length - selectedRoom.length));

    setRooms(rooms.map(room =>
      room.id === selectedRoom.id
        ? { ...room, x: boundedX, y: boundedY }
        : room
    ));
  };

  const handleRoomResize = (x: number, y: number) => {
    if (!resizeHandle) return;

    const gridSize = 20;
    const deltaX = Math.floor((x - resizeHandle.startX) / gridSize) * gridSize;
    const deltaY = Math.floor((y - resizeHandle.startY) / gridSize) * gridSize;

    const newRooms = rooms.map(room => {
      if (room.id === resizeHandle.room.id) {
        let newWidth = room.width;
        let newLength = room.length;
        let newX = room.x;
        let newY = room.y;

        switch (resizeHandle.edge) {
          case 'right':
            newWidth = Math.max(5, resizeHandle.startWidth + deltaX / gridSize);
            break;
          case 'bottom':
            newLength = Math.max(5, resizeHandle.startHeight + deltaY / gridSize);
            break;
          case 'bottomRight':
            newWidth = Math.max(5, resizeHandle.startWidth + deltaX / gridSize);
            newLength = Math.max(5, resizeHandle.startHeight + deltaY / gridSize);
            break;
        }

        newWidth = Math.min(newWidth, dimensions.width - newX);
        newLength = Math.min(newLength, dimensions.length - newY);
        newX = Math.max(0, Math.min(newX, dimensions.width - 5));
        newY = Math.max(0, Math.min(newY, dimensions.length - 5));

        return {
          ...room,
          width: newWidth,
          length: newLength,
          x: newX,
          y: newY,
        };
      }
      return room;
    });

    setRooms(newRooms);
  };

  return {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    resizeHandle,
    setResizeHandle,
    dragOffset,
    setDragOffset,
    handleRoomMove,
    handleRoomResize,
  };
};