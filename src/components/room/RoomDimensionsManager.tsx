import { useState } from "react";
import { DimensionInputs } from "./DimensionInputs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateRoomDimensions } from "@/utils/roomUtils";

interface RoomDimensionsManagerProps {
  dimensions: { width: number; length: number };
  onDimensionsChange: (dimensions: { width: number; length: number }) => void;
  error: string | null;
}

export const RoomDimensionsManager = ({
  dimensions,
  onDimensionsChange,
  error
}: RoomDimensionsManagerProps) => {
  return (
    <div className="space-y-4">
      <DimensionInputs 
        dimensions={dimensions} 
        setDimensions={onDimensionsChange}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};