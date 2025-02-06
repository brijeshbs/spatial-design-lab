import { useState } from "react";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";
import { Component, Room } from "@/components/playground/types";
import { usePlotState } from "@/hooks/usePlotState";
import { useRoomManagement } from "@/hooks/useRoomManagement";

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

    // Calculate room dimensions based on plot size and number of rooms
    const maxRoomsPerRow = Math.ceil(Math.sqrt(roomTypes.length));
    const roomWidth = Math.floor(width / maxRoomsPerRow) - 2; // Leave some spacing
    const roomLength = Math.floor(length / maxRoomsPerRow) - 2;

    // Generate rooms with proper spacing
    const generatedRooms = roomTypes.map((type, index) => {
      const row = Math.floor(index / maxRoomsPerRow);
      const col = index % maxRoomsPerRow;

      return {
        id: `room-${index}`,
        type,
        width: type === "Living Room" ? roomWidth + 2 : roomWidth,
        length: type === "Living Room" ? roomLength + 2 : roomLength,
        x: col * (roomWidth + 2), // Add spacing between rooms
        y: row * (roomLength + 2),
      };
    });

    setRooms(generatedRooms);
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