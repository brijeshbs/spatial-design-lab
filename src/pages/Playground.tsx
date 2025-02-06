import { useState } from "react";
import { PlaygroundLayout } from "@/components/playground/layout/PlaygroundLayout";
import { usePlotState } from "@/hooks/usePlotState";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { generateRoomLayout } from "@/utils/roomGenerationUtils";
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

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    setShowPlot(true);
    
    const generatedRooms = generateRoomLayout(roomTypes, { width, length });
    
    if (generatedRooms) {
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