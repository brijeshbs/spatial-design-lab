import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DimensionInputsProps {
  dimensions: { width: number; length: number };
  setDimensions: (dimensions: { width: number; length: number }) => void;
}

export const DimensionInputs = ({ dimensions, setDimensions }: DimensionInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="width">Width (ft)</Label>
        <Input
          id="width"
          type="number"
          value={dimensions.width}
          onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
          min={20}
          max={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="length">Length (ft)</Label>
        <Input
          id="length"
          type="number"
          value={dimensions.length}
          onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
          min={20}
          max={100}
        />
      </div>
    </>
  );
};