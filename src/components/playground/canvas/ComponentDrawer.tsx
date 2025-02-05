import { Component } from '../types';

interface ComponentDrawerProps {
  ctx: CanvasRenderingContext2D;
  component: Component;
  gridSize: number;
}

export const ComponentDrawer = ({ ctx, component, gridSize }: ComponentDrawerProps) => {
  ctx.save();
  
  ctx.translate(
    component.x + (component.width * gridSize) / 2,
    component.y + (component.length * gridSize) / 2
  );
  ctx.rotate((component.rotation * Math.PI) / 180);
  
  ctx.fillStyle = "#9CA3AF";
  ctx.fillRect(
    -(component.width * gridSize) / 2,
    -(component.length * gridSize) / 2,
    component.width * gridSize,
    component.length * gridSize
  );
  
  ctx.fillStyle = "#2C3E50";
  ctx.font = "10px Inter";
  ctx.textAlign = "center";
  ctx.fillText(component.type, 0, 0);
  
  ctx.restore();
  return null;
};