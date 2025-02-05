import { useState, useCallback } from "react";

export const useCanvasControls = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prevScale => Math.min(Math.max(0.1, prevScale * delta), 5));
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPanPosition.x,
        y: e.clientY - startPanPosition.y,
      });
    }
  }, [isPanning, startPanPosition]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    scale,
    position,
    isPanning,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  };
};