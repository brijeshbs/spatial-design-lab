import { useState } from "react";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";
import { Room } from "@/components/playground/types";
import { usePlotState } from "@/hooks/usePlotState";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { toast } from "@/components/ui/use-toast";

const Playground = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  
  const {
    dimensions,
    showPlot,
    setShowPlot,
  } = usePlotState();

  const {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
  } = useRoomManagement(dimensions);

  const isRoomOverlapping = (room: Room, existingRooms: Room[]) => {
    return existingRooms.some(existingRoom => {
      const overlapX = (room.x < existingRoom.x + existingRoom.width) &&
                      (room.x + room.width > existingRoom.x);
      const overlapY = (room.y < existingRoom.y + existingRoom.length) &&
                      (room.y + room.length > existingRoom.y);
      return overlapX && overlapY;
    });
  };

  const findValidPosition = (
    room: Room, 
    existingRooms: Room[], 
    maxWidth: number, 
    maxLength: number,
    attempts = 100
  ): Room | null => {
    for (let i = 0; i < attempts; i++) {
      const x = Math.floor(Math.random() * (maxWidth - room.width));
      const y = Math.floor(Math.random() * (maxLength - room.length));
      
      const testRoom = { ...room, x, y };
      
      if (!isRoomOverlapping(testRoom, existingRooms)) {
        return testRoom;
      }
    }
    return null;
  };

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    setShowPlot(true);

    const roomSizes: { [key: string]: { width: number; length: number } } = {
      "Master Bedroom": { width: 16, length: 11 },
      "Second Bedroom": { width: 8, length: 11 },
      "Children's Room": { width: 8, length: 11 },
      "Bathroom": { width: 8, length: 11 },
      "Living Room": { width: 12, length: 15 }
    };

    const generatedRooms: Room[] = [];

    for (const type of roomTypes) {
      const size = roomSizes[type] || { width: 8, length: 11 };
      
      // Create initial room with size but no position
      const room: Room = {
        id: `room-${generatedRooms.length}`,
        type,
        width: size.width,
        length: size.length,
        x: 0,
        y: 0,
      };

      // Try to find a valid position for the room
      const validRoom = findValidPosition(room, generatedRooms, width, length);

      if (validRoom) {
        generatedRooms.push(validRoom);
      } else {
        toast({
          title: "Room Placement Failed",
          description: `Could not find a valid position for ${type}. Try reducing room sizes or plot dimensions.`,
          variant: "destructive",
        });
        return;
      }
    }

    if (generatedRooms.length === roomTypes.length) {
      setRooms(generatedRooms);
      toast({
        title: "Layout Generated",
        description: "Floor plan has been generated with non-overlapping rooms",
      });
    }
  };

  return (
    <PlaygroundLayout
      showLeftSidebar={showLeftSidebar}
      setShowLeftSidebar={setShowLeftSidebar}
      showRightSidebar={showRightSidebar}
      setShowRightSidebar={setShowRightSidebar}
      rooms={rooms}
      selectedRoom={selectedRoom}
      dimensions={dimensions}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      showPlot={showPlot}
      onGenerateLayout={generateInitialLayout}
      onUpdateRoom={handleRoomUpdate}
    />
  );
};

export default Playground;