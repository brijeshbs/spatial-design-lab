import { useState } from "react";
import { Room } from "@/components/playground/types";

export const useRoomState = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

  return {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    handleRoomUpdate,
  };
};