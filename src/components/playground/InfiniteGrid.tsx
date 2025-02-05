import { useRef, useEffect } from "react";

interface InfiniteGridProps {
  width: number;
  height: number;
}

export const InfiniteGrid = ({ width, height }: InfiniteGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGrid = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw infinite grid background
      const gridSize = 20;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate grid offset to create infinite effect
      const offsetX = (window.scrollX % gridSize);
      const offsetY = (window.scrollY % gridSize);

      // Draw vertical lines
      for (let x = -offsetX; x <= canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -offsetY; y <= canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Initial draw
    drawGrid();

    // Add scroll event listener for infinite effect
    const handleScroll = () => {
      requestAnimationFrame(drawGrid);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 -z-10"
    />
  );
};