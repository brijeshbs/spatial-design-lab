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
    
    // Add walls
    newComponents.push({
      id: 'wall-top',
      type: 'Wall',
      width: width,
      length: 0.5,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-bottom',
      type: 'Wall',
      width: width,
      length: 0.5,
      x: 0,
      y: length - 0.5,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-left',
      type: 'Wall',
      width: 0.5,
      length: length,
      x: 0,
      y: 0,
      rotation: 0
    });
    
    newComponents.push({
      id: 'wall-right',
      type: 'Wall',
      width: 0.5,
      length: length,
      x: width - 0.5,
      y: 0,
      rotation: 0
    });

    // Add main entrance door
    newComponents.push({
      id: 'main-door',
      type: 'Door',
      width: 3,
      length: 0.5,
      x: width - 4,
      y: length - 0.5,
      rotation: 0
    });

    // Add windows
    newComponents.push({
      id: 'window-top',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: (width / 2) - 1.5,
      y: 0,
      rotation: 0
    });

    newComponents.push({
      id: 'window-left',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: 0,
      y: (length / 2) - 1.5,
      rotation: 90
    });

    newComponents.push({
      id: 'window-right',
      type: 'Window',
      width: 3,
      length: 0.5,
      x: width - 0.5,
      y: (length / 2) - 1.5,
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