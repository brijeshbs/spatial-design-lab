
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

export const isValidDropPosition = (
  dropX: number,
  dropY: number,
  width: number,
  length: number,
  components: Component[],
  currentComponent?: Component
): boolean => {
  return !components.some(component => {
    // Skip checking collision with itself
    if (currentComponent && component.id === currentComponent.id) {
      return false;
    }

    // Check for collision
    return !(
      dropX + width <= component.x ||
      dropX >= component.x + (component.width * 20) ||
      dropY + length <= component.y ||
      dropY >= component.y + (component.length * 20)
    );
  });
};

export const getResizeHandles = (component: Component, gridSize: number) => {
  const handles = [
    { id: 'topLeft', x: component.x, y: component.y },
    { id: 'topRight', x: component.x + (component.width * gridSize), y: component.y },
    { id: 'bottomLeft', x: component.x, y: component.y + (component.length * gridSize) },
    { id: 'bottomRight', x: component.x + (component.width * gridSize), y: component.y + (component.length * gridSize) }
  ];

  return handles;
};

export const isOverResizeHandle = (
  x: number,
  y: number,
  component: Component,
  gridSize: number,
  handleSize: number = 10
): string | null => {
  const handles = getResizeHandles(component, gridSize);
  
  for (const handle of handles) {
    if (
      Math.abs(x - handle.x) <= handleSize &&
      Math.abs(y - handle.y) <= handleSize
    ) {
      return handle.id;
    }
  }
  
  return null;
};

export const calculateNewDimensions = (
  component: Component,
  handle: string,
  mouseX: number,
  mouseY: number,
  gridSize: number,
  minSize: number = 1
): { width: number; length: number } => {
  let newWidth = component.width;
  let newLength = component.length;

  const startX = component.x;
  const startY = component.y;
  
  switch (handle) {
    case 'bottomRight':
      newWidth = Math.max(minSize, Math.round((mouseX - startX) / gridSize));
      newLength = Math.max(minSize, Math.round((mouseY - startY) / gridSize));
      break;
    case 'bottomLeft':
      newWidth = Math.max(minSize, Math.round((startX + (component.width * gridSize) - mouseX) / gridSize));
      newLength = Math.max(minSize, Math.round((mouseY - startY) / gridSize));
      break;
    case 'topRight':
      newWidth = Math.max(minSize, Math.round((mouseX - startX) / gridSize));
      newLength = Math.max(minSize, Math.round((startY + (component.length * gridSize) - mouseY) / gridSize));
      break;
    case 'topLeft':
      newWidth = Math.max(minSize, Math.round((startX + (component.width * gridSize) - mouseX) / gridSize));
      newLength = Math.max(minSize, Math.round((startY + (component.length * gridSize) - mouseY) / gridSize));
      break;
  }

  return { width: newWidth, length: newLength };
};
