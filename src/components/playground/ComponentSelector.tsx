import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { COMPONENTS } from "./constants";

interface ComponentSelectorProps {
  onSelect: (componentType: string) => void;
}

export const ComponentSelector = ({ onSelect }: ComponentSelectorProps) => {
  const structuralComponents = ["Wall", "Door", "Window"];
  const furnitureComponents = Object.keys(COMPONENTS).filter(
    (key) => !structuralComponents.includes(key)
  );

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
                className="w-full justify-start"
                onClick={() => onSelect(type)}
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
                className="w-full justify-start"
                onClick={() => onSelect(type)}
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