import { useState } from "react";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";
import { Component, Room } from "@/components/playground/types";
import { usePlotState } from "@/hooks/usePlotState";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { toast } from "@/components/ui/use-toast";

const Playground = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  
  const {
    dimensions,
    showPlot,
    components,
    generateStructuralComponents,
    handleComponentAdd,
    handleComponentMove,
    setShowPlot,
    setComponents,
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

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    // Generate structural components
    const structuralComponents = generateStructuralComponents(width, length);
    setComponents(structuralComponents);
    setShowPlot(true);

    // Define room sizes based on the image layout
    const roomSizes: { [key: string]: { width: number; length: number } } = {
      "Master Bedroom": { width: 16, length: 11 },
      "Second Bedroom": { width: 8, length: 11 },
      "Children's Room": { width: 8, length: 11 },
      "Bathroom": { width: 8, length: 11 },
      "Living Room": { width: 12, length: 15 }
    };

    // Generate rooms with proper positioning
    const generatedRooms = roomTypes.map((type, index) => {
      const size = roomSizes[type] || { width: 8, length: 11 };
      let x = 0;
      let y = 0;

      // Position rooms based on type (matching the image layout)
      switch (type) {
        case "Master Bedroom":
          x = 1;
          y = 1;
          break;
        case "Second Bedroom":
          x = 18;
          y = 1;
          break;
        case "Children's Room":
          x = 1;
          y = 15;
          break;
        case "Bathroom":
          x = 10;
          y = 15;
          break;
        case "Living Room":
          x = 1;
          y = 28;
          break;
      }

      return {
        id: `room-${index}`,
        type,
        width: size.width,
        length: size.length,
        x,
        y,
      };
    });

    setRooms(generatedRooms);
    toast({
      title: "Layout Generated",
      description: "Floor plan has been generated with the selected room types",
    });
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
      onComponentAdd={handleComponentAdd}
      components={components}
      onGenerateLayout={generateInitialLayout}
      onUpdateRoom={handleRoomUpdate}
    />
  );
};

export default Playground;