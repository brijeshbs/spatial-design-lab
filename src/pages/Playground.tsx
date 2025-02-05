import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { LeftSidebar } from "@/components/playground/LeftSidebar";
import { RightSidebar } from "@/components/playground/RightSidebar";
import { CanvasArea } from "@/components/playground/CanvasArea";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import type { Room } from "@/components/playground/types";
import { ROOM_TYPES } from "@/components/playground/constants";

const Playground = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const {
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
  } = useRoomManagement(dimensions);

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    setDimensions({ width, length });
    const newRooms: Room[] = roomTypes.map((type, index) => {
      const defaultSize = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        width: defaultSize.width,
        length: defaultSize.length,
        x: 0,
        y: index * defaultSize.length,
      };
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

  return (
    <div className="absolute inset-0 overflow-visible">
      <CanvasArea
        rooms={rooms}
        selectedRoom={selectedRoom}
        dimensions={dimensions}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      />

      <LeftSidebar
        showLeftSidebar={showLeftSidebar}
        setShowLeftSidebar={setShowLeftSidebar}
        onGenerate={generateInitialLayout}
      />

      <RightSidebar
        showRightSidebar={showRightSidebar}
        setShowRightSidebar={setShowRightSidebar}
        selectedRoom={selectedRoom}
        dimensions={dimensions}
        onUpdateRoom={handleRoomUpdate}
      />
    </div>
  );
};

export default Playground;
