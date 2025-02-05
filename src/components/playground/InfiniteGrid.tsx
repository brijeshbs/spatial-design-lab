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

    // Set canvas size to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawGrid = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate starting points based on scroll position
      const startX = Math.floor(window.scrollX / gridSize) * gridSize;
      const startY = Math.floor(window.scrollY / gridSize) * gridSize;
      const endX = startX + window.innerWidth + gridSize;
      const endY = startY + window.innerHeight + gridSize;

      // Draw vertical lines
      for (let x = startX; x <= endX; x += gridSize) {
        const offsetX = x - window.scrollX;
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = startY; y <= endY; y += gridSize) {
        const offsetY = y - window.scrollY;
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvas.width, offsetY);
        ctx.stroke();
      }
    };

    // Initial draw
    drawGrid();

    // Handle scroll
    const handleScroll = () => {
      requestAnimationFrame(drawGrid);
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
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
        pointerEvents: 'none'
      }}
    />
  );
};