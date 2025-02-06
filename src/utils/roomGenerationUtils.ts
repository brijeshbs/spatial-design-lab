import { Room } from "@/components/playground/types";
import { toast } from "@/components/ui/use-toast";

const DEFAULT_ROOM_SIZES: { [key: string]: { width: number; length: number } } = {
  "Master Bedroom": { width: 16, length: 11 },
  "Second Bedroom": { width: 8, length: 11 },
  "Children's Room": { width: 8, length: 11 },
  "Bathroom": { width: 8, length: 11 },
  "Living Room": { width: 12, length: 15 }
};

export const isRoomOverlapping = (room: Room, existingRooms: Room[]): boolean => {
  return existingRooms.some(existingRoom => {
    const overlapX = (room.x < existingRoom.x + existingRoom.width) &&
                    (room.x + room.width > existingRoom.x);
    const overlapY = (room.y < existingRoom.y + existingRoom.length) &&
                    (room.y + room.length > existingRoom.y);
    return overlapX && overlapY;
  });
};

export const findValidPosition = (
  room: Room, 
  existingRooms: Room[], 
  maxWidth: number, 
  maxLength: number,
  attempts = 100
): Room | null => {
  for (let i = 0; i < attempts; i++) {
    const x = Math.floor(Math.random() * (maxWidth - room.width));
    const y = Math.floor(Math.random() * (maxLength - room.length));
    
    const testRoom = { ...room, x, y };
    
    if (!isRoomOverlapping(testRoom, existingRooms)) {
      return testRoom;
    }
  }
  return null;
};

export const generateRoomLayout = (
  roomTypes: string[],
  dimensions: { width: number; length: number }
): Room[] | null => {
  const generatedRooms: Room[] = [];

  for (const type of roomTypes) {
    const size = DEFAULT_ROOM_SIZES[type] || { width: 8, length: 11 };
    
    const room: Room = {
      id: `room-${generatedRooms.length}`,
      type,
      width: size.width,
      length: size.length,
      x: 0,
      y: 0,
    };

    const validRoom = findValidPosition(room, generatedRooms, dimensions.width, dimensions.length);

    if (!validRoom) {
      toast({
        title: "Room Placement Failed",
        description: `Could not find a valid position for ${type}. Try reducing room sizes or plot dimensions.`,
        variant: "destructive",
      });
      return null;
    }

    generatedRooms.push(validRoom);
  }

  return generatedRooms;
};