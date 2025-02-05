import { Component } from "./types";
import { toast } from "@/components/ui/use-toast";

interface DragDropHandlerProps {
  position: { x: number; y: number };
  scale: number;
  onComponentAdd?: (component: Component) => void;
}

export const DragDropHandler = ({ position, scale, onComponentAdd }: DragDropHandlerProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    // Only handle component drag events
    const componentData = e.dataTransfer.types.includes('component');
    if (componentData) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    const componentData = e.dataTransfer.getData("component");
    if (componentData && onComponentAdd) {
      e.preventDefault();
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
      className="absolute inset-0 pointer-events-none"
      onDragOver={(e) => {
        e.currentTarget.style.pointerEvents = 'auto';
        handleDragOver(e);
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
      }}
      onDrop={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
        handleDrop(e);
      }}
    />
  );
};