import { Button } from "@/components/ui/button";
import { Component } from "../types";
import { COMPONENTS } from "../constants";
import { toast } from "@/components/ui/use-toast";

interface ComponentButtonProps {
  type: string;
  onSelect: (component: Component) => void;
}

export const ComponentButton = ({ type, onSelect }: ComponentButtonProps) => {
  const handleDragStart = (e: React.DragEvent) => {
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

  const handleClick = (e: React.MouseEvent) => {
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
    <Button
      variant="outline"
      className="w-full justify-start cursor-move"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {type}
    </Button>
  );
};