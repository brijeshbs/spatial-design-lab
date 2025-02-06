import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface DimensionInputsProps {
  dimensions: { width: number; length: number };
  setDimensions: (dimensions: { width: number; length: number }) => void;
}

export const DimensionInputs = ({ dimensions, setDimensions }: DimensionInputsProps) => {
  const handleDimensionChange = (dimension: 'width' | 'length', value: number) => {
    if (value < 20) {
      toast({
        title: "Invalid Dimension",
        description: "Minimum dimension is 20 feet",
        variant: "destructive",
      });
      return;
    }
    if (value > 100) {
      toast({
        title: "Invalid Dimension",
        description: "Maximum dimension is 100 feet",
        variant: "destructive",
      });
      return;
    }
    
    setDimensions({
      ...dimensions,
      [dimension]: value
    });
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="width">Width (ft)</Label>
        <Input
          id="width"
          type="number"
          value={dimensions.width}
          onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
          min={20}
          max={100}
          className="w-full"
        />
        <p className="text-xs text-gray-500">Min: 20ft, Max: 100ft</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="length">Length (ft)</Label>
        <Input
          id="length"
          type="number"
          value={dimensions.length}
          onChange={(e) => handleDimensionChange('length', Number(e.target.value))}
          min={20}
          max={100}
          className="w-full"
        />
        <p className="text-xs text-gray-500">Min: 20ft, Max: 100ft</p>
      </div>
    </>
  );
};