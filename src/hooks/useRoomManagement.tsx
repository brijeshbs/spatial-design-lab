import { useCallback } from "react";
import { Room, ResizeHandle } from "@/components/playground/types";
import { useRoomState } from "./useRoomState";
import { useDragState } from "./useDragState";
import { useResizeState } from "./useResizeState";
import { useRoomOperations } from "./useRoomOperations";

export const useRoomManagement = (dimensions: { width: number; length: number }) => {
  const {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    handleRoomUpdate,
  } = useRoomState();

  const {
    isDragging,
    setIsDragging,
    dragOffset,
    setDragOffset,
  } = useDragState();

  const {
    isResizing,
    setIsResizing,
    resizeHandle,
    setResizeHandle,
  } = useResizeState();

  const { handleRoomMove, handleRoomResize } = useRoomOperations(dimensions);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridSize = 20;

    // Check for resize handles
    if (selectedRoom) {
      const roomX = selectedRoom.x * gridSize;
      const roomY = selectedRoom.y * gridSize;
      const roomWidth = selectedRoom.width * gridSize;
      const roomLength = selectedRoom.length * gridSize;
      const handleSize = 8;

      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && 
          Math.abs(y - (roomY + roomLength)) <= handleSize) {
        setIsResizing(true);
        setResizeHandle({
          room: selectedRoom,
          edge: 'bottomRight',
          startX: x,
          startY: y,
          startWidth: selectedRoom.width,
          startHeight: selectedRoom.length,
          startRoomX: selectedRoom.x,
          startRoomY: selectedRoom.y,
        });
        return;
      }
    }

    // Handle room selection and drag start
    const clickedRoom = rooms.find(room => {
      const roomX = room.x * gridSize;
      const roomY = room.y * gridSize;
      const roomWidth = room.width * gridSize;
      const roomLength = room.length * gridSize;
      
      return x >= roomX && x <= roomX + roomWidth && 
             y >= roomY && y <= roomY + roomLength;
    });

    if (clickedRoom) {
      setSelectedRoom(clickedRoom);
      setIsDragging(true);
      setDragOffset({
        x: x - (clickedRoom.x * gridSize),
        y: y - (clickedRoom.y * gridSize),
      });
    } else {
      setSelectedRoom(null);
    }
  }, [rooms, selectedRoom, setSelectedRoom, setIsDragging, setDragOffset, setIsResizing, setResizeHandle]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridSize = 20;

    if (isResizing && resizeHandle && selectedRoom) {
      const deltaX = x - resizeHandle.startX;
      const deltaY = y - resizeHandle.startY;
      const updatedRoom = handleRoomResize(selectedRoom, deltaX, deltaY, resizeHandle.edge, gridSize);
      handleRoomUpdate(updatedRoom);
    } else if (isDragging && selectedRoom) {
      const newX = Math.floor((x - dragOffset.x) / gridSize);
      const newY = Math.floor((y - dragOffset.y) / gridSize);
      const updatedRoom = handleRoomMove(selectedRoom, newX, newY);
      handleRoomUpdate(updatedRoom);
    }
  }, [isDragging, isResizing, selectedRoom, resizeHandle, dragOffset, handleRoomMove, handleRoomResize, handleRoomUpdate]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, [setIsDragging, setIsResizing, setResizeHandle]);

  return {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleRoomUpdate,
  };
};