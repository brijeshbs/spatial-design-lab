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

  const handleRoomMove = (room: Room, newX: number, newY: number) => {
    // Ensure room stays within plot boundaries
    const constrainedX = Math.max(0, Math.min(newX, dimensions.width - room.width));
    const constrainedY = Math.max(0, Math.min(newY, dimensions.length - room.length));

    if (newX !== constrainedX || newY !== constrainedY) {
      toast({
        title: "Room Position Constrained",
        description: "Rooms must stay within the plot boundaries",
      });
    }

    return { ...room, x: constrainedX, y: constrainedY };
  };

  const handleRoomResize = (
    room: Room,
    deltaX: number,
    deltaY: number,
    edge: string,
    gridSize: number
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

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50; // Adjust for canvas translation
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    // Check for resize handles first
    if (selectedRoom) {
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;
      const handleSize = 8;

      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && 
          Math.abs(y - (roomY + roomLength)) <= handleSize) {
        setIsResizing(true);
        setResizeHandle({
          room: selectedRoom,
          edge: 'bottomRight',
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
  }, [rooms, selectedRoom, setSelectedRoom]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;
    const gridSize = 20;

    if (isResizing && resizeHandle && selectedRoom) {
      const deltaX = x - resizeHandle.startX;
      const deltaY = y - resizeHandle.startY;
      const updatedRoom = handleRoomResize(selectedRoom, deltaX, deltaY, resizeHandle.edge, gridSize);
      
      setRooms(rooms.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ));
    } else if (isDragging && selectedRoom) {
      const newX = Math.floor((x - dragOffset.x) / gridSize);
      const newY = Math.floor((y - dragOffset.y) / gridSize);
      const updatedRoom = handleRoomMove(selectedRoom, newX, newY);
      
      setRooms(rooms.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ));
    }
  }, [isDragging, isResizing, selectedRoom, resizeHandle, dragOffset, rooms, dimensions]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

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