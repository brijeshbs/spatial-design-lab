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
        
        // Calculate position relative to canvas and grid
        const x = Math.round((e.clientX - rect.left - position.x) / (20 * scale)) * 20;
        const y = Math.round((e.clientY - rect.top - position.y) / (20 * scale)) * 20;
        
        const newComponent = {
          ...component,
          x,
          y,
        };
        
        onComponentAdd(newComponent);
        
        toast({
          title: "Component Added",
          description: `${component.type} has been added to the canvas`,
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
      className="absolute inset-0 w-full h-full pointer-events-auto z-10"
      style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        transformOrigin: "top left",
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={(e) => {
        e.currentTarget.classList.add('bg-blue-100/20');
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('bg-blue-100/20');
      }}
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,20px)] grid-rows-[repeat(auto-fill,20px)] opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-dashed border-gray-300" />
        ))}
      </div>
    </div>
  );
};