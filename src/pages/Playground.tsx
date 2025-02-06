import { useState } from "react";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { usePlotState } from "@/hooks/usePlotState";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";
import type { Room } from "@/components/playground/types";

const Playground = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const {
    rooms,
    selectedRoom,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
  } = useRoomManagement(dimensions);

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

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    const structuralComponents = generateStructuralComponents(width, length);
    setComponents(structuralComponents);
    setShowPlot(true);
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