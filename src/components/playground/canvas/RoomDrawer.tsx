import { Room } from "../types";
import { ROOM_COLORS } from "../constants";

interface RoomDrawerProps {
  ctx: CanvasRenderingContext2D;
  room: Room;
  isSelected: boolean;
  gridSize: number;
  wallThickness: number;
}

export const RoomDrawer = ({
  ctx,
  room,
  isSelected,
  gridSize,
  wallThickness,
}: RoomDrawerProps) => {
  const roomColor = ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || "#E2E8F0";
  
  // Draw room fill
  ctx.fillStyle = roomColor;
  ctx.fillRect(
    room.x * gridSize + wallThickness / 2,
    room.y * gridSize + wallThickness / 2,
    room.width * gridSize - wallThickness,
    room.length * gridSize - wallThickness
  );
  
  // Draw room walls
  ctx.strokeStyle = isSelected ? "#3498DB" : "#403E43";
  ctx.lineWidth = wallThickness;
  ctx.strokeRect(
    room.x * gridSize + wallThickness / 2,
    room.y * gridSize + wallThickness / 2,
    room.width * gridSize - wallThickness,
    room.length * gridSize - wallThickness
  );

  // Draw room label
  ctx.fillStyle = "#2C3E50";
  ctx.font = "12px Inter";
  ctx.fillText(
    `${room.type} (${room.width}' × ${room.length}')`,
    room.x * gridSize + 5,
    room.y * gridSize + 20
  );
};