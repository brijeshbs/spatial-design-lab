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
    canvas.width = width;
    canvas.height = height;

    const drawGrid = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw infinite grid background
      const gridSize = 20;
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 0.5;

      // Calculate grid offset based on scroll position
      const offsetX = window.scrollX % gridSize;
      const offsetY = window.scrollY % gridSize;

      // Calculate number of lines needed to fill the screen
      const numVerticalLines = Math.ceil(width / gridSize) + 2;
      const numHorizontalLines = Math.ceil(height / gridSize) + 2;

      // Draw vertical lines
      for (let i = 0; i < numVerticalLines; i++) {
        const x = (i * gridSize) - offsetX;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 0; i < numHorizontalLines; i++) {
        const y = (i * gridSize) - offsetY;
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

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};