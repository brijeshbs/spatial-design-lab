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

  const generateStructuralComponents = (width: number, length: number) => {
    const newComponents: Component[] = [];
    
    // Add walls
    newComponents.push({
      id: 'wall-top',
      type: 'Wall',
      width: width,
      length: 0.5,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-bottom',
      type: 'Wall',
      width: width,
      length: 0.5,
      x: 0,
      y: length - 0.5,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-left',
      type: 'Wall',
      width: 0.5,
      length: length,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-right',
      type: 'Wall',
      width: 0.5,
      length: length,
      x: width - 0.5,
      y: 0,
      rotation: 0
    });

    // Add main entrance door
    newComponents.push({
      id: 'main-door',
      type: 'Door',
      width: 3,
      length: 0.5,
      x: width - 4,
      y: length - 0.5,
      rotation: 0
    });

    // Add windows
    newComponents.push({
      id: 'window-top',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: (width / 2) - 1.5,
      y: 0,
      rotation: 0
    });

    newComponents.push({
      id: 'window-left',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: 0,
      y: (length / 2) - 1.5,
      rotation: 90
    });

    newComponents.push({
      id: 'window-right',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: width - 0.5,
      y: (length / 2) - 1.5,
      rotation: 90
    });

    return newComponents;
  };

  const findValidPosition = (
    room: { width: number; length: number },
    existingRooms: Room[],
    plotDimensions: { width: number; length: number },
    maxAttempts: number = 50
  ): { x: number; y: number } | null => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.floor(Math.random() * (plotDimensions.width - room.width));
      const y = Math.floor(Math.random() * (plotDimensions.length - room.length));

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
    return null;
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
    
    // Generate and add structural components
    const structuralComponents = generateStructuralComponents(width, length);
    setComponents(structuralComponents);
  };

  const handleComponentAdd = (component: Component) => {
    setComponents(prev => [...prev, component]);
    toast({
      title: "Component Added",
      description: `${component.type} has been placed on the canvas`,
    });
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
        onComponentAdd={handleComponentAdd}
        components={components}
      />

      <LeftSidebar
        showLeftSidebar={showLeftSidebar}
        setShowLeftSidebar={setShowLeftSidebar}
        onGenerate={generateInitialLayout}
        onComponentSelect={handleComponentAdd}
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