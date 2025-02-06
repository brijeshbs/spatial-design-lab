import { useState, useCallback } from "react";
import { Component } from "@/components/playground/types";

export const useComponentState = () => {
  const [components, setComponents] = useState<Component[]>([]);

  const addComponent = useCallback((component: Component) => {
    setComponents(prev => [...prev, component]);
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

  const removeComponent = useCallback((componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
  }, []);

  return {
    components,
    addComponent,
    updateComponentPosition,
    removeComponent,
  };
};