import { Component } from "./types";
import { toast } from "@/components/ui/use-toast";

interface DragDropHandlerProps {
  position: { x: number; y: number };
  scale: number;
  onComponentAdd?: (component: Component) => void;
}

export const DragDropHandler = ({ position, scale, onComponentAdd }: DragDropHandlerProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");
    if (componentData && onComponentAdd) {
      try {
        const component = JSON.parse(componentData) as Component;
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;
        
        component.x = Math.round(x / 20) * 20; // Snap to grid
        component.y = Math.round(y / 20) * 20; // Snap to grid
        
        onComponentAdd(component);
        toast({
          title: "Component Added",
          description: `${component.type} has been placed on the canvas`,
        });
      } catch (error) {
        console.error("Error adding component:", error);
        toast({
          title: "Error",
          description: "Failed to add component to canvas",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div 
      className="absolute inset-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
};