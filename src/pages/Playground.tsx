import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { LeftSidebar } from "@/components/playground/LeftSidebar";
import { RightSidebar } from "@/components/playground/RightSidebar";
import { CanvasArea } from "@/components/playground/CanvasArea";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import type { Room, Component } from "@/components/playground/types";
import { ROOM_TYPES } from "@/components/playground/constants";

const Playground = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showPlot, setShowPlot] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);

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

  const handleComponentSelect = (component: Component) => {
    setComponents(prev => [...prev, component]);
    toast({
      title: "Component Added",
      description: `Added ${component.type} to the canvas. Click to place it.`,
    });
  };

  const findValidPosition = (
    room: { width: number; length: number },
    existingRooms: Room[],
    plotDimensions: { width: number; length: number },
    maxAttempts: number = 50
  ): { x: number; y: number } | null => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate random position within plot boundaries
      const x = Math.floor(Math.random() * (plotDimensions.width - room.width));
      const y = Math.floor(Math.random() * (plotDimensions.length - room.length));

      // Check if this position overlaps with any existing room
      const hasOverlap = existingRooms.some(existingRoom => {
        return !(
          x + room.width <= existingRoom.x ||
          x >= existingRoom.x + existingRoom.width ||
          y + room.length <= existingRoom.y ||
          y >= existingRoom.y + existingRoom.length
        );
      });

      if (!hasOverlap) {
        return { x, y };
      }
    }
    return null; // Could not find valid position
  };

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    setDimensions({ width, length });
    const newRooms: Room[] = [];

    roomTypes.forEach((type) => {
      const defaultSize = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
      const room = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        width: defaultSize.width,
        length: defaultSize.length,
        x: 0,
        y: 0,
      };

      const position = findValidPosition(room, newRooms, { width, length });
      
      if (position) {
        room.x = position.x;
        room.y = position.y;
        newRooms.push(room);
      } else {
        toast({
          title: "Room Placement Failed",
          description: `Could not find valid position for ${type}. Try adjusting plot size or removing some rooms.`,
          variant: "destructive",
        });
      }
    });

    setRooms(newRooms);
    setShowPlot(true);
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
        showPlot={showPlot}
        components={components}
      />

      <LeftSidebar
        showLeftSidebar={showLeftSidebar}
        setShowLeftSidebar={setShowLeftSidebar}
        onGenerate={generateInitialLayout}
        onComponentSelect={handleComponentSelect}
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