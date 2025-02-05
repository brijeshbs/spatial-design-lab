import { useState, useCallback } from "react";
import { Room, Component } from "./types";
import { ThreeDCanvas } from "./ThreeDCanvas";
import { InfiniteGrid } from "./InfiniteGrid";
import { DragDropHandler } from "./DragDropHandler";
import { CanvasControls } from "./CanvasControls";
import { CanvasViewport } from "./canvas/CanvasViewport";
import { TransformableCanvas } from "./canvas/TransformableCanvas";
import { useCanvasControls } from "./canvas/useCanvasControls";
import { useComponentState } from "@/hooks/useComponentState";

interface CanvasAreaProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  showPlot?: boolean;
}

export const CanvasArea = ({
  rooms,
  selectedRoom,
  dimensions,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  showPlot = false,
}: CanvasAreaProps) => {
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  
  const {
    scale,
    position,
    isPanning,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useCanvasControls();

  const {
    components,
    addComponent,
    updateComponentPosition,
  } = useComponentState();

  const handleComponentMove = useCallback((component: Component, newX: number, newY: number) => {
    updateComponentPosition(component.id, newX, newY);
  }, [updateComponentPosition]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePanStart(e);
    if (!isPanning) {
      onMouseDown(e);
    }
  }, [handlePanStart, isPanning, onMouseDown]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePanMove(e);
    if (!isPanning) {
      onMouseMove(e);
    }
  }, [handlePanMove, isPanning, onMouseMove]);

  const handleCanvasMouseUp = useCallback(() => {
    handlePanEnd();
    if (!isPanning) {
      onMouseUp();
    }
  }, [handlePanEnd, isPanning, onMouseUp]);

  return (
    <CanvasViewport onWheel={handleWheel}>
      {viewMode === '2d' ? (
        <>
          <InfiniteGrid width={window.innerWidth} height={window.innerHeight} scale={scale} position={position} />
          <TransformableCanvas
            scale={scale}
            position={position}
            rotation={rotation}
            rooms={rooms}
            selectedRoom={selectedRoom}
            dimensions={dimensions}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={onMouseLeave}
            showPlot={showPlot}
            components={components}
            onComponentMove={handleComponentMove}
          />
          <DragDropHandler
            position={position}
            scale={scale}
            onComponentAdd={addComponent}
          />
        </>
      ) : (
        <ThreeDCanvas
          rooms={rooms}
          selectedRoom={selectedRoom}
          dimensions={dimensions}
          components={components}
        />
      )}
      
      <CanvasControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        rotation={rotation}
        setRotation={setRotation}
      />
    </CanvasViewport>
  );
};