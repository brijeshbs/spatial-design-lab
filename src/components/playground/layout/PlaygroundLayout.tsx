import { LeftSidebar } from "@/components/playground/LeftSidebar";
import { RightSidebar } from "@/components/playground/RightSidebar";
import { CanvasArea } from "@/components/playground/CanvasArea";
import { Room, Component } from "@/components/playground/types";

interface PlaygroundLayoutProps {
  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  showPlot: boolean;
  onComponentAdd: (component: Component) => void;
  components: Component[];
  onGenerateLayout: ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => void;
  onUpdateRoom: (room: Room) => void;
}

export const PlaygroundLayout = ({
  showLeftSidebar,
  setShowLeftSidebar,
  showRightSidebar,
  setShowRightSidebar,
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  showPlot,
  onComponentAdd,
  components,
  onGenerateLayout,
  onUpdateRoom,
}: PlaygroundLayoutProps) => {
  return (
    <div className="absolute inset-0 overflow-visible">
      <CanvasArea
        rooms={rooms}
        selectedRoom={selectedRoom}
        dimensions={dimensions}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        showPlot={showPlot}
        onComponentAdd={onComponentAdd}
        components={components}
      />

      <LeftSidebar
        showLeftSidebar={showLeftSidebar}
        setShowLeftSidebar={setShowLeftSidebar}
        onGenerate={onGenerateLayout}
        onComponentSelect={onComponentAdd}
      />

      <RightSidebar
        showRightSidebar={showRightSidebar}
        setShowRightSidebar={setShowRightSidebar}
        selectedRoom={selectedRoom}
        dimensions={dimensions}
        onUpdateRoom={onUpdateRoom}
      />
    </div>
  );
};