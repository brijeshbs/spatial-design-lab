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
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
    };

    updateCanvasSize();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20 * scale;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate grid offset based on position and scale
      const offsetX = (position.x * scale) % gridSize;
      const offsetY = (position.y * scale) % gridSize;

      // Calculate visible area with padding
      const startX = -gridSize * 2;
      const startY = -gridSize * 2;
      const endX = canvas.width + gridSize * 2;
      const endY = canvas.height + gridSize * 2;

      // Draw vertical lines
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x - offsetX, startY);
        ctx.lineTo(x - offsetX, endY);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y - offsetY);
        ctx.lineTo(endX, y - offsetY);
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
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};