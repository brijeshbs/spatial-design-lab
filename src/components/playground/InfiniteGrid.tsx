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

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
    };

    updateCanvasSize();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate grid offset based on scroll position
      const offsetX = window.scrollX % gridSize;
      const offsetY = window.scrollY % gridSize;

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

    const handleScroll = () => {
      requestAnimationFrame(drawGrid);
    };

    const handleResize = () => {
      updateCanvasSize();
      drawGrid();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    drawGrid();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        transform: 'translate3d(0,0,0)'
      }}
    />
  );
};