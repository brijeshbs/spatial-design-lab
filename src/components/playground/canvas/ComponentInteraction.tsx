import { Component } from '../types';

interface ComponentInteractionProps {
  components: Component[];
  x: number;
  y: number;
  gridSize: number;
}

export const findClickedComponent = ({ components, x, y, gridSize }: ComponentInteractionProps): Component | undefined => {
  return components.find(component => {
    const componentX = component.x;
    const componentY = component.y;
    const componentWidth = component.width * gridSize;
    const componentLength = component.length * gridSize;

    return (
      x >= componentX &&
      x <= componentX + componentWidth &&
      y >= componentY &&
      y <= componentY + componentLength
    );
  });
};