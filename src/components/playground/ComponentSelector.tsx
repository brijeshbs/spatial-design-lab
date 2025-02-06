import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { COMPONENTS } from "./constants";
import { Component } from "./types";
import { toast } from "@/components/ui/use-toast";

interface ComponentSelectorProps {
  onSelect: (component: Component) => void;
}

export const ComponentSelector = ({ onSelect }: ComponentSelectorProps) => {
  const structuralComponents = ["Wall", "Door", "Window", "Staircase"];
  const furnitureComponents = Object.keys(COMPONENTS).filter(
    (key) => !structuralComponents.includes(key)
  );

  const handleDragStart = (e: React.DragEvent, type: string) => {
    const componentSpec = COMPONENTS[type as keyof typeof COMPONENTS];
    const newComponent: Component = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      width: componentSpec.width,
      length: componentSpec.length,
      x: 0,
      y: 0,
      rotation: 0,
    };
    e.dataTransfer.setData("component", JSON.stringify(newComponent));
  };

  const handleClick = (type: string) => {
    const componentSpec = COMPONENTS[type as keyof typeof COMPONENTS];
    if (!componentSpec) {
      toast({
        title: "Error",
        description: `Invalid component type: ${type}`,
        variant: "destructive",
      });
      return;
    }

    const newComponent: Component = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      width: componentSpec.width,
      length: componentSpec.length,
      x: 200,
      y: 200,
      rotation: 0,
    };

    if (onSelect) {
      onSelect(newComponent);
      toast({
        title: "Component Added",
        description: `${type} has been placed on the canvas`,
      });
    }
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium text-mane-primary">Structural</h3>
          <div className="grid grid-cols-2 gap-2">
            {structuralComponents.map((type) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onClick={() => handleClick(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 text-sm font-medium text-mane-primary">
            Furniture & Appliances
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {furnitureComponents.map((type) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onClick={() => handleClick(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};