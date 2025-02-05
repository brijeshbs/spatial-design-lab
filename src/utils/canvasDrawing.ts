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
  // Set text properties
  ctx.fillStyle = "#2C3E50";
  ctx.font = "bold 14px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw width dimension
  const widthText = `${dimensions.width} ft`;
  ctx.fillText(
    widthText,
    (dimensions.width * gridSize) / 2,
    -20
  );

  // Draw length dimension
  ctx.save();
  ctx.translate(-20, (dimensions.length * gridSize) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(
    `${dimensions.length} ft`,
    0,
    0
  );
  ctx.restore();

  // Draw dimension lines and arrows
  const arrowSize = 5;
  
  // Width arrows
  ctx.beginPath();
  ctx.moveTo(-5, -10);
  ctx.lineTo(dimensions.width * gridSize + 5, -10);
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw arrowheads for width
  ctx.beginPath();
  ctx.moveTo(-5, -10 - arrowSize);
  ctx.lineTo(-5, -10 + arrowSize);
  ctx.lineTo(-10, -10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(dimensions.width * gridSize + 5, -10 - arrowSize);
  ctx.lineTo(dimensions.width * gridSize + 5, -10 + arrowSize);
  ctx.lineTo(dimensions.width * gridSize + 10, -10);
  ctx.closePath();
  ctx.fill();

  // Length arrows
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-10, dimensions.length * gridSize + 5);
  ctx.stroke();

  // Draw arrowheads for length
  ctx.beginPath();
  ctx.moveTo(-10 - arrowSize, -5);
  ctx.lineTo(-10 + arrowSize, -5);
  ctx.lineTo(-10, -10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-10 - arrowSize, dimensions.length * gridSize + 5);
  ctx.lineTo(-10 + arrowSize, dimensions.length * gridSize + 5);
  ctx.lineTo(-10, dimensions.length * gridSize + 10);
  ctx.closePath();
  ctx.fill();
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