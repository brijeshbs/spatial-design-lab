import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { COMPONENTS } from "./constants";
import { Component } from "./types";
import { ComponentCategory } from "./components/ComponentCategory";

interface ComponentSelectorProps {
  onSelect: (component: Component) => void;
}

export const ComponentSelector = ({ onSelect }: ComponentSelectorProps) => {
  const structuralComponents = ["Wall", "Door", "Window", "Staircase"];
  const furnitureComponents = Object.keys(COMPONENTS).filter(
    (key) => !structuralComponents.includes(key)
  );

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <ComponentCategory
          title="Structural"
          components={structuralComponents}
          onSelect={onSelect}
        />

        <Separator />

        <ComponentCategory
          title="Furniture & Appliances"
          components={furnitureComponents}
          onSelect={onSelect}
        />
      </div>
    </ScrollArea>
  );
};