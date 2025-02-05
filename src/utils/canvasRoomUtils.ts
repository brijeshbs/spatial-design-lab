import { Room } from "@/components/playground/types";
import { ROOM_COLORS } from "@/components/playground/constants";

export const drawRoom = (
  ctx: CanvasRenderingContext2D,
  room: Room,
  isSelected: boolean,
  gridSize: number,
  wallThickness: number
) => {
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
};

export const drawRoomWindows = (
  ctx: CanvasRenderingContext2D,
  room: Room,
  gridSize: number
) => {
  const windowWidth = 3 * gridSize;
  const windowHeight = gridSize / 2;
  ctx.fillStyle = "#D3E4FD";

  // Top wall window
  ctx.fillRect(
    room.x * gridSize + (room.width * gridSize / 2) - (windowWidth / 2),
    room.y * gridSize,
    windowWidth,
    windowHeight
  );

  // Left wall window
  ctx.fillRect(
    room.x * gridSize,
    room.y * gridSize + (room.length * gridSize / 2) - (windowWidth / 2),
    windowHeight,
    windowWidth
  );
};

export const drawRoomDoors = (
  ctx: CanvasRenderingContext2D,
  room: Room,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  const doorWidth = 3 * gridSize;
  const doorHeight = gridSize / 2;
  ctx.fillStyle = "#2C3E50";

  if (room.type !== "Living Room") {
    ctx.fillRect(
      room.x * gridSize + room.width * gridSize - doorWidth,
      room.y * gridSize + room.length * gridSize - doorHeight,
      doorWidth,
      doorHeight
    );
  } else {
    // Living Room door alongside plot door
    ctx.fillRect(
      dimensions.width * gridSize - doorWidth - (4 * gridSize),
      dimensions.length * gridSize - doorHeight,
      doorWidth,
      doorHeight
    );
  }
};

export const drawRoomLabel = (
  ctx: CanvasRenderingContext2D,
  room: Room,
  gridSize: number
) => {
  ctx.fillStyle = "#2C3E50";
  ctx.font = "12px Inter";
  ctx.fillText(
    `${room.type} (${room.width}' × ${room.length}')`,
    room.x * gridSize + 5,
    room.y * gridSize + 20
  );
};