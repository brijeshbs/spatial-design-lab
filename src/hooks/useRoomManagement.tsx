import { useCallback, useState } from "react";
import { Room, ResizeHandle } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useRoomManagement = (dimensions: { width: number; length: number }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const gridSize = 20;
    const handleSize = 10;

    // Check for resize handles first
    if (selectedRoom) {
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;

      // Check corners
      const corners = [
        { x: roomX, y: roomY, edge: 'topLeft' },
        { x: roomX + roomWidth, y: roomY, edge: 'topRight' },
        { x: roomX, y: roomY + roomLength, edge: 'bottomLeft' },
        { x: roomX + roomWidth, y: roomY + roomLength, edge: 'bottomRight' },
      ];

      for (const corner of corners) {
        if (Math.abs(x - corner.x) <= handleSize && Math.abs(y - corner.y) <= handleSize) {
          setIsResizing(true);
          setResizeHandle({
            room: selectedRoom,
            edge: corner.edge as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
            startX: x,
            startY: y,
            startWidth: selectedRoom.width,
            startHeight: selectedRoom.length,
            startRoomX: selectedRoom.x,
            startRoomY: selectedRoom.y,
          });
          return;
        }
      }

      // Check edges
      const edges = [
        { x: roomX + roomWidth / 2, y: roomY, edge: 'top' },
        { x: roomX + roomWidth, y: roomY + roomLength / 2, edge: 'right' },
        { x: roomX + roomWidth / 2, y: roomY + roomLength, edge: 'bottom' },
        { x: roomX, y: roomY + roomLength / 2, edge: 'left' },
      ];

      for (const edge of edges) {
        if (Math.abs(x - edge.x) <= handleSize && Math.abs(y - edge.y) <= handleSize) {
          setIsResizing(true);
          setResizeHandle({
            room: selectedRoom,
            edge: edge.edge as 'top' | 'right' | 'bottom' | 'left',
            startX: x,
            startY: y,
            startWidth: selectedRoom.width,
            startHeight: selectedRoom.length,
            startRoomX: selectedRoom.x,
            startRoomY: selectedRoom.y,
          });
          return;
        }
      }
    }

    // Handle room selection and drag start
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
  }, [rooms, selectedRoom]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const gridSize = 20;

    if (isResizing && resizeHandle && selectedRoom) {
      const deltaX = Math.floor((x - resizeHandle.startX) / gridSize);
      const deltaY = Math.floor((y - resizeHandle.startY) / gridSize);
      let newWidth = resizeHandle.startWidth;
      let newLength = resizeHandle.startHeight;
      let newX = resizeHandle.startRoomX;
      let newY = resizeHandle.startRoomY;

      switch (resizeHandle.edge) {
        case 'right':
          newWidth = Math.max(5, resizeHandle.startWidth + deltaX);
          break;
        case 'bottom':
          newLength = Math.max(5, resizeHandle.startHeight + deltaY);
          break;
        case 'left':
          newWidth = Math.max(5, resizeHandle.startWidth - deltaX);
          newX = resizeHandle.startRoomX + deltaX;
          break;
        case 'top':
          newLength = Math.max(5, resizeHandle.startHeight - deltaY);
          newY = resizeHandle.startRoomY + deltaY;
          break;
        case 'bottomRight':
          newWidth = Math.max(5, resizeHandle.startWidth + deltaX);
          newLength = Math.max(5, resizeHandle.startHeight + deltaY);
          break;
        case 'bottomLeft':
          newWidth = Math.max(5, resizeHandle.startWidth - deltaX);
          newX = resizeHandle.startRoomX + deltaX;
          newLength = Math.max(5, resizeHandle.startHeight + deltaY);
          break;
        case 'topRight':
          newWidth = Math.max(5, resizeHandle.startWidth + deltaX);
          newLength = Math.max(5, resizeHandle.startHeight - deltaY);
          newY = resizeHandle.startRoomY + deltaY;
          break;
        case 'topLeft':
          newWidth = Math.max(5, resizeHandle.startWidth - deltaX);
          newX = resizeHandle.startRoomX + deltaX;
          newLength = Math.max(5, resizeHandle.startHeight - deltaY);
          newY = resizeHandle.startRoomY + deltaY;
          break;
      }

      // Constrain to plot dimensions
      if (newX < 0) {
        newX = 0;
        newWidth = selectedRoom.width;
      }
      if (newY < 0) {
        newY = 0;
        newLength = selectedRoom.length;
      }
      if (newX + newWidth > dimensions.width) {
        newWidth = dimensions.width - newX;
      }
      if (newY + newLength > dimensions.length) {
        newLength = dimensions.length - newY;
      }

      const updatedRoom = {
        ...selectedRoom,
        width: newWidth,
        length: newLength,
        x: newX,
        y: newY,
      };

      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === selectedRoom.id ? updatedRoom : room
        )
      );
    } else if (isDragging && selectedRoom) {
      const newX = Math.floor((x - dragOffset.x) / gridSize);
      const newY = Math.floor((y - dragOffset.y) / gridSize);
      
      // Constrain to plot dimensions
      const constrainedX = Math.max(0, Math.min(newX, dimensions.width - selectedRoom.width));
      const constrainedY = Math.max(0, Math.min(newY, dimensions.length - selectedRoom.length));
      
      const updatedRoom = {
        ...selectedRoom,
        x: constrainedX,
        y: constrainedY,
      };

      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === selectedRoom.id ? updatedRoom : room
        )
      );
    }
  }, [isDragging, isResizing, selectedRoom, resizeHandle, dragOffset, dimensions]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isResizing) {
      toast({
        title: "Room Resized",
        description: "Room dimensions have been updated",
      });
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, [isResizing]);

  const handleRoomUpdate = useCallback((updatedRoom: Room) => {
    setRooms(prevRooms =>
      prevRooms.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
  }, []);

  return {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
  };
};