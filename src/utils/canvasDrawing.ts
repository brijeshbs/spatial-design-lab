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
  
  // Draw corner handles
  const corners = [
    [0, 0], // top-left
    [room.width * gridSize, 0], // top-right
    [0, room.length * gridSize], // bottom-left
    [room.width * gridSize, room.length * gridSize], // bottom-right
  ];

  corners.forEach(([hx, hy]) => {
    ctx.fillRect(
      room.x * gridSize + hx - handleSize/2,
      room.y * gridSize + hy - handleSize/2,
      handleSize,
      handleSize
    );
  });

  // Draw edge handles with arrows
  const edges = [
    { x: room.width * gridSize / 2, y: 0, isHorizontal: true }, // top
    { x: room.width * gridSize, y: room.length * gridSize / 2, isHorizontal: false }, // right
    { x: room.width * gridSize / 2, y: room.length * gridSize, isHorizontal: true }, // bottom
    { x: 0, y: room.length * gridSize / 2, isHorizontal: false } // left
  ];

  edges.forEach(({ x, y, isHorizontal }) => {
    // Draw handle rectangle
    ctx.fillRect(
      room.x * gridSize + x - handleSize/2,
      room.y * gridSize + y - handleSize/2,
      handleSize,
      handleSize
    );

    // Draw bidirectional arrows
    const arrowSize = 12;
    ctx.strokeStyle = "#3498DB";
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (isHorizontal) {
      // Draw horizontal arrows (<->)
      // Left arrow
      ctx.moveTo(room.x * gridSize + x - arrowSize, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x - arrowSize/2, room.y * gridSize + y);
      ctx.moveTo(room.x * gridSize + x - arrowSize, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x - arrowSize + 4, room.y * gridSize + y - 4);
      ctx.moveTo(room.x * gridSize + x - arrowSize, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x - arrowSize + 4, room.y * gridSize + y + 4);

      // Right arrow
      ctx.moveTo(room.x * gridSize + x + arrowSize/2, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x + arrowSize, room.y * gridSize + y);
      ctx.moveTo(room.x * gridSize + x + arrowSize, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x + arrowSize - 4, room.y * gridSize + y - 4);
      ctx.moveTo(room.x * gridSize + x + arrowSize, room.y * gridSize + y);
      ctx.lineTo(room.x * gridSize + x + arrowSize - 4, room.y * gridSize + y + 4);
    } else {
      // Draw vertical arrows (^v)
      // Up arrow
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y - arrowSize);
      ctx.lineTo(room.x * gridSize + x, room.y * gridSize + y - arrowSize/2);
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y - arrowSize);
      ctx.lineTo(room.x * gridSize + x - 4, room.y * gridSize + y - arrowSize + 4);
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y - arrowSize);
      ctx.lineTo(room.x * gridSize + x + 4, room.y * gridSize + y - arrowSize + 4);

      // Down arrow
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y + arrowSize/2);
      ctx.lineTo(room.x * gridSize + x, room.y * gridSize + y + arrowSize);
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y + arrowSize);
      ctx.lineTo(room.x * gridSize + x - 4, room.y * gridSize + y + arrowSize - 4);
      ctx.moveTo(room.x * gridSize + x, room.y * gridSize + y + arrowSize);
      ctx.lineTo(room.x * gridSize + x + 4, room.y * gridSize + y + arrowSize - 4);
    }
    ctx.stroke();
  });
};