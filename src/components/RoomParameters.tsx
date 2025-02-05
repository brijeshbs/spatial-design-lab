import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface RoomParametersProps {
  onGenerate: (dimensions: { width: number; length: number }) => void;
}

export const RoomParameters = ({ onGenerate }: RoomParametersProps) => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (dimensions.width < 20 || dimensions.length < 20) {
      setError("Minimum dimensions are 20x20 ft");
      return;
    }
    if (dimensions.width > 100 || dimensions.length > 100) {
      setError("Maximum dimensions are 100x100 ft");
      return;
    }
    setError(null);
    onGenerate(dimensions);
    toast({
      title: "Floor Plan Generated",
      description: `Created with dimensions ${dimensions.width}x${dimensions.length} ft`,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">House Parameters</h3>
      
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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleGenerate} className="w-full">
        Generate Floor Plan
      </Button>
    </div>
  );
};