import { Button } from "@/components/ui/button";
import { Box, View } from "lucide-react";
import { Compass } from "./Compass";

interface CanvasControlsProps {
  viewMode: '2d' | '3d';
  setViewMode: (mode: '2d' | '3d') => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

export const CanvasControls = ({ 
  viewMode, 
  setViewMode, 
  rotation, 
  setRotation 
}: CanvasControlsProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <Button
        variant="outline"
        size="icon"
        className="bg-white"
        onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
      >
        {viewMode === '2d' ? <Box className="h-4 w-4" /> : <View className="h-4 w-4" />}
      </Button>
      {viewMode === '2d' && (
        <Compass size={80} rotation={rotation} onRotate={setRotation} />
      )}
    </div>
  );
};