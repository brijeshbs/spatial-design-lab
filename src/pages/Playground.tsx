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
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
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