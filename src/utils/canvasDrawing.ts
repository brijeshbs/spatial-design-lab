export const drawPlotBorder = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  const plotWidth = dimensions.width * gridSize;
  const plotLength = dimensions.length * gridSize;
  
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  // Draw all four sides of the plot
  // North border
  ctx.moveTo(0, 0);
  ctx.lineTo(plotWidth, 0);
  
  // East border
  ctx.moveTo(plotWidth, 0);
  ctx.lineTo(plotWidth, plotLength);
  
  // South border
  ctx.moveTo(plotWidth, plotLength);
  ctx.lineTo(0, plotLength);
  
  // West border
  ctx.moveTo(0, plotLength);
  ctx.lineTo(0, 0);
  
  ctx.stroke();
};

export const drawPlotDimensions = (
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; length: number },
  gridSize: number
) => {
  const plotWidth = dimensions.width * gridSize;
  const plotLength = dimensions.length * gridSize;
  
  ctx.fillStyle = "#666666";
  ctx.font = "12px Inter";
  
  // Width dimension on top
  ctx.fillText(
    `${dimensions.width}'`,
    plotWidth / 2 - 15,
    -10
  );
  
  // Length dimension on left
  ctx.save();
  ctx.translate(-10, plotLength / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${dimensions.length}'`, -15, 0);
  ctx.restore();
  
  // Width dimension on bottom
  ctx.fillText(
    `${dimensions.width}'`,
    plotWidth / 2 - 15,
    plotLength + 20
  );
  
  // Length dimension on right
  ctx.save();
  ctx.translate(plotWidth + 10, plotLength / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`${dimensions.length}'`, -15, 0);
  ctx.restore();
};