import { useCallback, useState } from "react";
import { Room } from "@/components/playground/types";
import { useRoomInteractions } from "./useRoomInteractions";

export const useRoomManagement = (dimensions: { width: number; length: number }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const {
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
  } = useRoomInteractions(dimensions);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const gridSize = 20;
    const handleSize = 10;

    if (selectedRoom) {
      // Check for resize handles
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;

      // Check corners and edges for resize handles
      const handlePoints = [
        { x: roomX, y: roomY, edge: 'topLeft' },
        { x: roomX + roomWidth, y: roomY, edge: 'topRight' },
        { x: roomX, y: roomY + roomLength, edge: 'bottomLeft' },
        { x: roomX + roomWidth, y: roomY + roomLength, edge: 'bottomRight' },
        { x: roomX + roomWidth / 2, y: roomY, edge: 'top' },
        { x: roomX + roomWidth, y: roomY + roomLength / 2, edge: 'right' },
        { x: roomX + roomWidth / 2, y: roomY + roomLength, edge: 'bottom' },
        { x: roomX, y: roomY + roomLength / 2, edge: 'left' },
      ];

      for (const point of handlePoints) {
        if (Math.abs(x - point.x) <= handleSize && Math.abs(y - point.y) <= handleSize) {
          setIsResizing(true);
          setResizeHandle({
            room: selectedRoom,
            edge: point.edge as any,
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
  }, [rooms, selectedRoom, setIsResizing, setResizeHandle]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const gridSize = 20;
    
    if (isResizing && resizeHandle && selectedRoom) {
      const deltaX = Math.floor((e.clientX - resizeHandle.startX) / gridSize);
      const deltaY = Math.floor((e.clientY - resizeHandle.startY) / gridSize);
      
      const updatedRoom = handleRoomResize(selectedRoom, deltaX, deltaY, resizeHandle.edge, gridSize);
      
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === selectedRoom.id ? updatedRoom : room
        )
      );
    } else if (isDragging && selectedRoom) {
      const newX = Math.floor((e.clientX - dragOffset.x) / gridSize);
      const newY = Math.floor((e.clientY - dragOffset.y) / gridSize);
      
      const updatedRoom = handleRoomMove(selectedRoom, newX, newY);
      
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === selectedRoom.id ? updatedRoom : room
        )
      );
    }
  }, [isDragging, isResizing, selectedRoom, resizeHandle, dragOffset, handleRoomResize, handleRoomMove]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

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