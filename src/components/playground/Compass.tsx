interface CompassProps {
  size: number;
  x: number;
  y: number;
}

export const Compass = ({ size, x, y }: CompassProps) => {
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Draw compass circle
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw compass needle
    ctx.beginPath();
    ctx.moveTo(x, y + size/3);
    ctx.lineTo(x, y - size/3);
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw N indicator
    ctx.fillStyle = "#2C3E50";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("N", x, y - size/2 - 5);
  };

  return { draw };
};