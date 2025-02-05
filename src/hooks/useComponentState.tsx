import { useState, useCallback } from "react";
import { Component } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

export const useComponentState = () => {
  const [components, setComponents] = useState<Component[]>([]);

  const addComponent = useCallback((component: Component) => {
    setComponents(prev => [...prev, component]);
    toast({
      title: "Component Added",
      description: `${component.type} has been placed on the canvas`,
    });
  }, []);

  const updateComponentPosition = useCallback((componentId: string, newX: number, newY: number) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, x: newX, y: newY }
          : comp
      )
    );
  }, []);

  return {
    components,
    addComponent,
    updateComponentPosition,
  };
};