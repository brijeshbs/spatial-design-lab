
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

  const generateInitialLayout = (params: { width: number; length: number; roomTypes: string[] }) => {
    setDimensions({ width: params.width, length: params.length });
    
    // Create initial rooms based on selected room types
    const initialRooms: Room[] = params.roomTypes.map((type, index) => ({
      id: `room-${index}`,
      type,
      width: Math.floor(params.width / 2),
      length: Math.floor(params.length / 2),
      x: 0,
      y: 0
    }));

    setRooms(initialRooms);
    if (initialRooms.length > 0) {
      setSelectedRoom(initialRooms[0]);
    }

    toast({
      title: "Layout Generated",
      description: `Created layout with ${params.roomTypes.length} rooms`,
    });
  };

  const handleComponentAdd = (component: Component) => {
    setComponents(prev => [...prev, component]);
  };

  const handleComponentMove = (component: Component, newX: number, newY: number) => {
    setComponents(prev => 
      prev.map(c => 
        c.id === component.id 
          ? { ...c, x: newX, y: newY }
          : c
      )
    );
  };

  const handleComponentResize = (component: Component, newWidth: number, newLength: number) => {
    setComponents(prev => 
      prev.map(c => 
        c.id === component.id 
          ? { ...c, width: newWidth, length: newLength }
          : c
      )
    );
  };

  const handleComponentDelete = (component: Component) => {
    setComponents(prev => prev.filter(c => c.id !== component.id));
    toast({
      title: "Component Deleted",
      description: `${component.type} has been removed`,
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
        components={components}
        onComponentAdd={handleComponentAdd}
        onComponentMove={handleComponentMove}
        onComponentResize={handleComponentResize}
        onComponentDelete={handleComponentDelete}
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
