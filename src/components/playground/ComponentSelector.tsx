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
    e.stopPropagation();
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
      x: 0,
      y: 0,
      rotation: 0,
    };

    e.dataTransfer.setData("component", JSON.stringify(newComponent));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
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
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400),
      rotation: 0,
    };

    onSelect(newComponent);
    toast({
      title: "Component Added",
      description: `${type} has been added to the canvas`,
    });
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
                className="w-full justify-start cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onClick={(e) => handleClick(e, type)}
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
                className="w-full justify-start cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                onClick={(e) => handleClick(e, type)}
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