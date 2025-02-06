import { Room } from "@/components/playground/types";
import { ROOM_TYPES } from "@/components/playground/constants";
import { toast } from "@/components/ui/use-toast";

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
  // Start from the center of the plot
  const centerX = Math.floor((maxWidth - room.width) / 2);
  const centerY = Math.floor((maxLength - room.length) / 2);
  
  // Try center position first
  const centerRoom = { ...room, x: centerX, y: centerY };
  if (!isRoomOverlapping(centerRoom, existingRooms)) {
    return centerRoom;
  }

  // If center doesn't work, try other positions
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
  console.log("Generating room layout for types:", roomTypes);

  // Sort rooms by size (largest first) to optimize placement
  const sortedRoomTypes = [...roomTypes].sort((a, b) => {
    const roomA = ROOM_TYPES[a as keyof typeof ROOM_TYPES];
    const roomB = ROOM_TYPES[b as keyof typeof ROOM_TYPES];
    return (roomB.width * roomB.length) - (roomA.width * roomA.length);
  });

  for (const type of sortedRoomTypes) {
    const roomSize = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
    console.log(`Attempting to place ${type} with size:`, roomSize);
    
    const room: Room = {
      id: `room-${generatedRooms.length + 1}`,
      type,
      width: roomSize.width,
      length: roomSize.length,
      x: 0,
      y: 0,
    };

    const validRoom = findValidPosition(room, generatedRooms, dimensions.width, dimensions.length);

    if (!validRoom) {
      console.error(`Failed to place ${type}`);
      toast({
        title: "Room Placement Failed",
        description: `Could not find a valid position for ${type}. Try reducing the number of rooms or increasing plot dimensions.`,
        variant: "destructive",
      });
      return null;
    }

    console.log(`Successfully placed ${type} at:`, { x: validRoom.x, y: validRoom.y });
    generatedRooms.push(validRoom);
  }

  console.log("Final room layout:", generatedRooms);
  return generatedRooms;
};