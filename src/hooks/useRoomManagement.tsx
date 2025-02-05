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

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridSize = 20;

    // Check for resize handles first
    for (const room of rooms) {
      const roomX = room.x * gridSize;
      const roomY = room.y * gridSize;
      const roomWidth = room.width * gridSize;
      const roomLength = room.length * gridSize;
      const handleSize = 8;

      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && Math.abs(y - (roomY + roomLength)) <= handleSize) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'bottomRight',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }

      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && y >= roomY && y <= roomY + roomLength) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'right',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }

      if (Math.abs(y - (roomY + roomLength)) <= handleSize && x >= roomX && x <= roomX + roomWidth) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'bottom',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }
    }

    const clickedRoom = rooms.find(room => {
      const roomX = room.x * gridSize;
      const roomY = room.y * gridSize;
      const roomWidth = room.width * gridSize;
      const roomLength = room.length * gridSize;
      
      return x >= roomX && x <= roomX + roomWidth && 
             y >= roomY && y <= roomY + roomLength;
    });

    if (clickedRoom) {
      setSelectedRoom(clickedRoom);
      setIsDragging(true);
      setDragOffset({
        x: x - (clickedRoom.x * gridSize),
        y: y - (clickedRoom.y * gridSize),
      });
    } else {
      setSelectedRoom(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing) {
      handleRoomResize(x, y);
    } else if (isDragging) {
      const gridSize = 20;
      const newX = Math.floor((x - dragOffset.x) / gridSize);
      const newY = Math.floor((y - dragOffset.y) / gridSize);
      handleRoomMove(newX, newY);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (selectedRoom) {
        toast({
          title: "Room Moved",
          description: `${selectedRoom.type} has been repositioned`,
        });
      }
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      if (selectedRoom) {
        toast({
          title: "Room Resized",
          description: `${selectedRoom.type} has been resized`,
        });
      }
    }
  };

  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

  return {
    rooms,
    selectedRoom,
    handleRoomMove,
    handleRoomResize,
    handleRoomUpdate,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  };
};
