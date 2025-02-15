
import { useState } from "react";
import { Component } from "./types";
import { toast } from "@/components/ui/use-toast";
import { isValidDropPosition } from "./canvas/ComponentInteraction";

interface DragDropHandlerProps {
  position: { x: number; y: number };
  scale: number;
  onComponentAdd?: (component: Component) => void;
}

export const DragDropHandler = ({ position, scale, onComponentAdd }: DragDropHandlerProps) => {
  const [dragOverPosition, setDragOverPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingValid, setIsDraggingValid] = useState(true);

  const handleDragOver = (e: React.DragEvent) => {
    const componentData = e.dataTransfer.types.includes('component');
    if (componentData) {
      e.preventDefault();
      
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / scale;
      const y = (e.clientY - rect.top - position.y) / scale;
      
      // Snap to grid
      const snappedX = Math.round(x / 20) * 20;
      const snappedY = Math.round(y / 20) * 20;
      
      setDragOverPosition({ x: snappedX, y: snappedY });
      
      try {
        const component = JSON.parse(e.dataTransfer.getData("component")) as Component;
        const isValid = true; // You can implement more validation here
        setIsDraggingValid(isValid);
        e.dataTransfer.dropEffect = isValid ? "copy" : "none";
      } catch (error) {
        setIsDraggingValid(false);
        e.dataTransfer.dropEffect = "none";
      }
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
        
        // Snap to grid
        component.x = Math.round(x / 20) * 20;
        component.y = Math.round(y / 20) * 20;
        
        if (component.x < 0 || component.y < 0) {
          toast({
            title: "Invalid Position",
            description: "Components must be placed within the plot boundaries",
            variant: "destructive",
          });
          return;
        }
        
        onComponentAdd(component);
        toast({
          title: "Component Added",
          description: `${component.type} has been placed at position (${component.x}, ${component.y})`,
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
    setDragOverPosition(null);
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onDragOver={(e) => {
        e.currentTarget.style.pointerEvents = 'auto';
        handleDragOver(e);
      }}
      onDragEnter={(e) => {
        e.currentTarget.classList.add('bg-blue-100/10');
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
        e.currentTarget.classList.remove('bg-blue-100/10');
        setDragOverPosition(null);
      }}
      onDrop={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
        e.currentTarget.classList.remove('bg-blue-100/10');
        handleDrop(e);
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,20px)] grid-rows-[repeat(auto-fill,20px)] opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-dashed border-gray-300" />
        ))}
      </div>

      {/* Preview ghost */}
      {dragOverPosition && (
        <div
          className={`absolute pointer-events-none border-2 ${
            isDraggingValid ? 'border-green-500/50 bg-green-100/20' : 'border-red-500/50 bg-red-100/20'
          } transition-colors duration-200`}
          style={{
            left: `${dragOverPosition.x}px`,
            top: `${dragOverPosition.y}px`,
            width: '40px',
            height: '40px',
            transform: `scale(${scale})`,
            transformOrigin: '0 0'
          }}
        />
      )}
    </div>
  );
};
