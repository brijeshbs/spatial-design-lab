import { useState } from "react";
import { Component } from "@/components/playground/types";
import { ROOM_TYPES } from "@/components/playground/constants";
import { toast } from "@/components/ui/use-toast";

export const usePlotState = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [showPlot, setShowPlot] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);

  const generateStructuralComponents = (width: number, length: number) => {
    const newComponents: Component[] = [];
    const wallThickness = 0.5;
    
    // Add walls
    // Top wall
    newComponents.push({
      id: 'wall-top',
      type: 'Wall',
      width: width,
      length: wallThickness,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    // Bottom wall
    newComponents.push({
      id: 'wall-bottom',
      type: 'Wall',
      width: width,
      length: wallThickness,
      x: 0,
      y: length - wallThickness,
      rotation: 0
    });
    
    // Left wall
    newComponents.push({
      id: 'wall-left',
      type: 'Wall',
      width: wallThickness,
      length: length,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    // Right wall
    newComponents.push({
      id: 'wall-right',
      type: 'Wall',
      width: wallThickness,
      length: length,
      x: width - wallThickness,
      y: 0,
      rotation: 0
    });

    // Add main entrance door
    newComponents.push({
      id: 'main-door',
      type: 'Door',
      width: 3,
      length: wallThickness,
      x: width - 4,
      y: length - wallThickness,
      rotation: 0
    });

    // Add windows based on the layout in the image
    // Top wall windows
    newComponents.push({
      id: 'window-top-1',
      type: 'Window',
      width: 3,
      length: wallThickness,
      x: width / 4,
      y: 0,
      rotation: 0
    });

    newComponents.push({
      id: 'window-top-2',
      type: 'Window',
      width: 3,
      length: wallThickness,
      x: (width * 3) / 4,
      y: 0,
      rotation: 0
    });

    // Left wall windows
    newComponents.push({
      id: 'window-left-1',
      type: 'Window',
      width: 3,
      length: wallThickness,
      x: 0,
      y: length / 4,
      rotation: 90
    });

    newComponents.push({
      id: 'window-left-2',
      type: 'Window',
      width: 3,
      length: wallThickness,
      x: 0,
      y: (length * 3) / 4,
      rotation: 90
    });

    // Right wall windows
    newComponents.push({
      id: 'window-right',
      type: 'Window',
      width: 3,
      length: wallThickness,
      x: width - wallThickness,
      y: length / 2,
      rotation: 90
    });

    return newComponents;
  };

  const handleComponentAdd = (component: Component) => {
    setComponents(prev => [...prev, component]);
    toast({
      title: "Component Added",
      description: `${component.type} has been added to the canvas`,
    });
  };

  const handleComponentMove = (component: Component, newX: number, newY: number) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === component.id 
          ? { ...comp, x: newX, y: newY }
          : comp
      )
    );
  };

  return {
    dimensions,
    setDimensions,
    showPlot,
    setShowPlot,
    components,
    setComponents,
    generateStructuralComponents,
    handleComponentAdd,
    handleComponentMove,
  };
};