export const drawPlotBorder = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  const plotWidth = dimensions.width * gridSize;
  const plotLength = dimensions.length * gridSize;
  
  // Clear any existing drawings
  ctx.clearRect(0, 0, plotWidth + 100, plotLength + 100);
  
  // Set border style
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  
  // Draw plot border as a complete rectangle
  ctx.beginPath();
  ctx.rect(0, 0, plotWidth, plotLength);
  ctx.stroke();
  ctx.closePath();
};

export const drawPlotDimensions = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  const plotWidth = dimensions.width * gridSize;
  const plotLength = dimensions.length * gridSize;
  
  // Set text style
  ctx.fillStyle = "#666666";
  ctx.font = "14px Inter";
  ctx.textAlign = "center";
  
  // Width dimensions (top and bottom)
  ctx.fillText(
    `${dimensions.width}'`,
    plotWidth / 2,
    -10
  );
  ctx.fillText(
    `${dimensions.width}'`,
    plotWidth / 2,
    plotLength + 20
  );
  
  // Length dimensions (left and right)
  ctx.save();
  // Left dimension
  ctx.translate(-10, plotLength / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${dimensions.length}'`, 0, 0);
  ctx.restore();
  
  // Right dimension
  ctx.save();
  ctx.translate(plotWidth + 10, plotLength / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`${dimensions.length}'`, 0, 0);
  ctx.restore();
};