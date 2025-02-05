import { useRef, useEffect } from "react";

interface InfiniteGridProps {
  width: number;
  height: number;
  scale: number;
  position: { x: number; y: number };
}

export const InfiniteGrid = ({ width, height, scale, position }: InfiniteGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    updateCanvasSize();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20 * scale;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;

      // Calculate grid offset based on position and scale
      const offsetX = (position.x * scale) % gridSize;
      const offsetY = (position.y * scale) % gridSize;

      // Draw vertical lines
      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const handleResize = () => {
      updateCanvasSize();
      drawGrid();
    };

    window.addEventListener('resize', handleResize);
    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [scale, position]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    />
  );
};