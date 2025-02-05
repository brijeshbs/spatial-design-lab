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
      ctx.clearRect(0, 0, width, height);

      // Draw infinite grid background
      const gridSize = 20;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate grid offset to create infinite effect
      const offsetX = (window.scrollX % gridSize);
      const offsetY = (window.scrollY % gridSize);

      // Draw vertical lines
      for (let x = -offsetX; x <= width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -offsetY; y <= height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
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
    window.addEventListener('resize', drawGrid);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', drawGrid);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};