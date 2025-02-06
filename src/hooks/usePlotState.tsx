import { useState } from "react";
import { Component } from "@/components/playground/types";
import { ROOM_TYPES } from "@/components/playground/constants";
import { toast } from "@/components/ui/use-toast";

export const usePlotState = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [showPlot, setShowPlot] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);

  const generateStructuralComponents = (width: number, length: number) => {
    // Return empty array since we want to remove all components
    return [];
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