import { useState } from "react";

export const useDragState = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  return {
    isDragging,
    setIsDragging,
    dragOffset,
    setDragOffset,
  };
};