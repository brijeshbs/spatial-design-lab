import { Component } from "./types";
import { toast } from "@/components/ui/use-toast";

interface DragDropHandlerProps {
  position: { x: number; y: number };
  scale: number;
  onComponentAdd?: (component: Component) => void;
}

export const DragDropHandler = ({ position, scale, onComponentAdd }: DragDropHandlerProps) => {
  const handleDragOver = (e: React.DragEvent) => {
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
        
        component.x = Math.round(x / 20) * 20;
        component.y = Math.round(y / 20) * 20;
        
        onComponentAdd(component);
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
        e.currentTarget.classList.add('bg-blue-100/20');
        handleDragOver(e);
      }}
      onDragEnter={(e) => {
        e.currentTarget.classList.add('bg-blue-100/20');
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
        e.currentTarget.classList.remove('bg-blue-100/20');
      }}
      onDrop={(e) => {
        e.currentTarget.style.pointerEvents = 'none';
        e.currentTarget.classList.remove('bg-blue-100/20');
        handleDrop(e);
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