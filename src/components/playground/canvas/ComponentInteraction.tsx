import { Component } from '../types';

interface ComponentInteractionProps {
  components: Component[];
  x: number;
  y: number;
  gridSize: number;
}

export const findClickedComponent = ({ components, x, y, gridSize }: ComponentInteractionProps): Component | undefined => {
  // Add a small buffer around components for easier selection
  const buffer = 5;
  return components.find(component => {
    const componentX = component.x;
    const componentY = component.y;
    const componentWidth = component.width * gridSize;
    const componentLength = component.length * gridSize;

    return (
      x >= componentX - buffer &&
      x <= componentX + componentWidth + buffer &&
      y >= componentY - buffer &&
      y <= componentY + componentLength + buffer
    );
  });
};

export const isValidDropPosition = (
  x: number,
  y: number,
  components: Component[],
  newComponent: Component,
  gridSize: number
): boolean => {
  // Check if the new component would overlap with any existing components
  return !components.some(component => {
    const componentX = component.x;
    const componentY = component.y;
    const componentWidth = component.width * gridSize;
    const componentLength = component.length * gridSize;
    
    const newX = x;
    const newY = y;
    const newWidth = newComponent.width * gridSize;
    const newLength = newComponent.length * gridSize;

    return !(
      newX + newWidth <= componentX ||
      newX >= componentX + componentWidth ||
      newY + newLength <= componentY ||
      newY >= componentY + componentLength
    );
  });
};