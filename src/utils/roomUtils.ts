import { ROOM_TYPES } from "@/components/playground/constants";
import { toast } from "@/components/ui/use-toast";

export const calculateTotalRoomArea = (roomTypes: string[]) => {
  return roomTypes.reduce((sum, type) => {
    const room = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
    return sum + (room.width * room.length);
  }, 0);
};

export const validateRoomDimensions = (width: number, length: number): string | null => {
  if (width < 20 || length < 20) {
    return "Minimum dimensions are 20x20 ft";
  }
  if (width > 100 || length > 100) {
    return "Maximum dimensions are 100x100 ft";
  }
  return null;
};

export const validateTotalRoomArea = (roomTypes: string[], plotWidth: number, plotLength: number): boolean => {
  const totalRoomArea = calculateTotalRoomArea(roomTypes);
  const plotArea = plotWidth * plotLength;
  
  if (totalRoomArea > plotArea) {
    toast({
      title: "Invalid Room Configuration",
      description: "Total room area cannot exceed plot area. Please remove some rooms or increase plot size.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const handleLivingRoomModification = () => {
  toast({
    title: "Cannot Modify Living Room",
    description: "Living Room is required and cannot be modified.",
    variant: "destructive",
  });
};