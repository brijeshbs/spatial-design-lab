import { useCallback, useState } from "react";

interface CanvasViewportProps {
  children: React.ReactNode;
  onWheel: (e: React.WheelEvent) => void;
}

export const CanvasViewport = ({ children, onWheel }: CanvasViewportProps) => {
  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      onWheel={onWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};