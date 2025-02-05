import { Room } from "./types";
import { RoomCanvas } from "./RoomCanvas";
import { InfiniteGrid } from "./InfiniteGrid";

interface CanvasAreaProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const CanvasArea = ({
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: CanvasAreaProps) => {
  return (
    <>
      <InfiniteGrid width={window.innerWidth} height={window.innerHeight} />
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="pointer-events-auto">
          <RoomCanvas
            rooms={rooms}
            selectedRoom={selectedRoom}
            dimensions={dimensions}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </div>
    </>
  );
};