import { ComponentButton } from "./ComponentButton";
import { Component } from "../types";

interface ComponentCategoryProps {
  title: string;
  components: string[];
  onSelect: (component: Component) => void;
}

export const ComponentCategory = ({ title, components, onSelect }: ComponentCategoryProps) => {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-mane-primary">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {components.map((type) => (
          <ComponentButton key={type} type={type} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};