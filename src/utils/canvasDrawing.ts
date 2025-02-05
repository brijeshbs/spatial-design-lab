export const drawPlotBorder = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(dimensions.width * gridSize, 0);
  ctx.lineTo(dimensions.width * gridSize, dimensions.length * gridSize);
  ctx.lineTo(0, dimensions.length * gridSize);
  ctx.lineTo(0, 0);
  ctx.stroke();
};

export const drawPlotDimensions = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  ctx.fillStyle = "#2C3E50";
  ctx.font = "12px Inter";
  ctx.fillText(
    `${dimensions.width} ft`,
    dimensions.width * gridSize / 2 - 20,
    -5
  );
  ctx.fillText(
    `${dimensions.length} ft`,
    -25,
    dimensions.length * gridSize / 2
  );
};

export const drawRoomHandles = (
  ctx: CanvasRenderingContext2D,
  room: { x: number; y: number; width: number; length: number },
  gridSize: number
) => {
  const handleSize = 8;
  ctx.fillStyle = "#3498DB";
  
  const handlePositions = [
    [0, 0],
    [room.width * gridSize, 0],
    [0, room.length * gridSize],
    [room.width * gridSize, room.length * gridSize],
    [room.width * gridSize / 2, 0],
    [room.width * gridSize, room.length * gridSize / 2],
    [room.width * gridSize / 2, room.length * gridSize],
    [0, room.length * gridSize / 2]
  ];

  handlePositions.forEach(([hx, hy]) => {
    ctx.fillRect(
      room.x * gridSize + hx - handleSize/2,
      room.y * gridSize + hy - handleSize/2,
      handleSize,
      handleSize
    );
  });
};