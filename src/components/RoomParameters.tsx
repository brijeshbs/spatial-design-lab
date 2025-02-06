import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DimensionInputs } from "./room/DimensionInputs";
import { RoomSelector } from "./room/RoomSelector";
import { 
  calculateTotalRoomArea, 
  validateRoomDimensions, 
  handleLivingRoomModification,
  validateTotalRoomArea 
} from "@/utils/roomUtils";

interface RoomParametersProps {
  onGenerate: (dimensions: { width: number; length: number; roomTypes: string[] }) => void;
}

export const RoomParameters = ({ onGenerate }: RoomParametersProps) => {
  const [dimensions, setDimensions] = useState({ width: 100, length: 100 }); // Updated initial dimensions
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(["Living Room"]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleDimensionsChange = (newDimensions: { width: number; length: number }) => {
    setDimensions(newDimensions);
    // Clear any previous errors when dimensions change
    setError(null);
  };

  const handleToggleRoom = (roomType: string) => {
    if (roomType === "Living Room") {
      handleLivingRoomModification();
      return;
    }

    const newRoomTypes = [...selectedRoomTypes, roomType];
    
    if (!validateTotalRoomArea(newRoomTypes, dimensions.width, dimensions.length)) {
      return;
    }
    
    setSelectedRoomTypes(newRoomTypes);
  };

  const handleRemoveRoom = (index: number) => {
    if (selectedRoomTypes[index] === "Living Room") {
      handleLivingRoomModification();
      return;
    }

    const newRoomTypes = [...selectedRoomTypes];
    newRoomTypes.splice(index, 1);
    setSelectedRoomTypes(newRoomTypes);
  };

  const handleGenerate = () => {
    const dimensionError = validateRoomDimensions(dimensions.width, dimensions.length);
    if (dimensionError) {
      setError(dimensionError);
      return;
    }
    
    if (selectedRoomTypes.length === 0) {
      setError("Please select at least one room type");
      return;
    }

    if (!validateTotalRoomArea(selectedRoomTypes, dimensions.width, dimensions.length)) {
      setError("Total room area exceeds plot dimensions");
      return;
    }

    setError(null);
    onGenerate({ ...dimensions, roomTypes: selectedRoomTypes });
    toast({
      title: "Floor Plan Generated",
      description: `Created with dimensions ${dimensions.width}x${dimensions.length} ft and ${selectedRoomTypes.length} rooms`,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white max-h-[calc(100vh-200px)] flex flex-col">
      <h3 className="text-lg font-semibold">House Parameters</h3>
      
      <DimensionInputs 
        dimensions={dimensions} 
        setDimensions={handleDimensionsChange}
      />
      
      <ScrollArea className="flex-1 w-full pr-4">
        <RoomSelector
          selectedRoomTypes={selectedRoomTypes}
          onToggleRoom={handleToggleRoom}
          onRemoveRoom={handleRemoveRoom}
          open={open}
          setOpen={setOpen}
        />
      </ScrollArea>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleGenerate} className="w-full mt-4">
        Generate Floor Plan
      </Button>
    </div>
  );
};