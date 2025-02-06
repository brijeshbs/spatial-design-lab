import { useState } from "react";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { usePlotState } from "@/hooks/usePlotState";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";

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
    selectedRoom,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
    setRooms,
  } = useRoomManagement(dimensions);

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    // Generate structural components
    const structuralComponents = generateStructuralComponents(width, length);
    setComponents(structuralComponents);
    setShowPlot(true);

    // Generate rooms based on room types
    const generatedRooms = roomTypes.map((type, index) => ({
      id: `room-${index}`,
      type,
      width: Math.min(15, Math.floor(width / 2)),  // Default room width
      length: Math.min(15, Math.floor(length / 2)), // Default room length
      x: index * 2, // Offset each room slightly
      y: index * 2,
    }));

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