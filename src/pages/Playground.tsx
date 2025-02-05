import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { RoomParameters } from "@/components/RoomParameters";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfiniteGrid } from "@/components/playground/InfiniteGrid";
import { RoomCanvas } from "@/components/playground/RoomCanvas";
import { ROOM_TYPES } from "@/components/playground/constants";
import type { Room, ResizeHandle } from "@/components/playground/types";

const Playground = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const generateInitialLayout = ({ width, length, roomTypes }: { width: number; length: number; roomTypes: string[] }) => {
    setDimensions({ width, length });
    const newRooms: Room[] = roomTypes.map((type, index) => {
      const defaultSize = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        width: defaultSize.width,
        length: defaultSize.length,
        x: 0,
        y: index * defaultSize.length,
      };
    });
    setRooms(newRooms);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridSize = 20;

    // Check for resize handles first
    for (const room of rooms) {
      const roomX = room.x * gridSize;
      const roomY = room.y * gridSize;
      const roomWidth = room.width * gridSize;
      const roomLength = room.length * gridSize;
      const handleSize = 8;

      // Check corners first (they take precedence)
      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && Math.abs(y - (roomY + roomLength)) <= handleSize) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'bottomRight',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }

      // Then check edges
      if (Math.abs(x - (roomX + roomWidth)) <= handleSize && y >= roomY && y <= roomY + roomLength) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'right',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }

      if (Math.abs(y - (roomY + roomLength)) <= handleSize && x >= roomX && x <= roomX + roomWidth) {
        setIsResizing(true);
        setResizeHandle({
          room,
          edge: 'bottom',
          startX: x,
          startY: y,
          startWidth: room.width,
          startHeight: room.length,
          startRoomX: room.x,
          startRoomY: room.y,
        });
        return;
      }
    }

    // If not resizing, check for dragging
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
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const gridSize = 20;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing && resizeHandle) {
      const deltaX = Math.floor((x - resizeHandle.startX) / gridSize) * gridSize;
      const deltaY = Math.floor((y - resizeHandle.startY) / gridSize) * gridSize;

      const newRooms = rooms.map(room => {
        if (room.id === resizeHandle.room.id) {
          let newWidth = room.width;
          let newLength = room.length;
          let newX = room.x;
          let newY = room.y;

          switch (resizeHandle.edge) {
            case 'right':
              newWidth = Math.max(5, resizeHandle.startWidth + deltaX / gridSize);
              break;
            case 'bottom':
              newLength = Math.max(5, resizeHandle.startHeight + deltaY / gridSize);
              break;
            case 'bottomRight':
              newWidth = Math.max(5, resizeHandle.startWidth + deltaX / gridSize);
              newLength = Math.max(5, resizeHandle.startHeight + deltaY / gridSize);
              break;
          }

          // Ensure room stays within house boundaries
          newWidth = Math.min(newWidth, dimensions.width - newX);
          newLength = Math.min(newLength, dimensions.length - newY);
          newX = Math.max(0, Math.min(newX, dimensions.width - 5));
          newY = Math.max(0, Math.min(newY, dimensions.length - 5));

          return {
            ...room,
            width: newWidth,
            length: newLength,
            x: newX,
            y: newY,
          };
        }
        return room;
      });

      setRooms(newRooms);
    } else if (isDragging && selectedRoom) {
      const newX = Math.floor((x - dragOffset.x) / gridSize);
      const newY = Math.floor((y - dragOffset.y) / gridSize);

      const boundedX = Math.max(0, Math.min(newX, dimensions.width - selectedRoom.width));
      const boundedY = Math.max(0, Math.min(newY, dimensions.length - selectedRoom.length));

      setRooms(rooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, x: boundedX, y: boundedY }
          : room
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (selectedRoom) {
        toast({
          title: "Room Moved",
          description: `${selectedRoom.type} has been repositioned`,
        });
      }
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      if (selectedRoom) {
        toast({
          title: "Room Resized",
          description: `${selectedRoom.type} has been resized`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-mane-background relative overflow-hidden">
      <InfiniteGrid width={window.innerWidth} height={window.innerHeight} />
      
      {/* Left Sidebar */}
      <div className={cn(
        "fixed left-4 top-4 bg-white p-4 shadow-lg rounded-lg transition-transform duration-300 z-10",
        !showLeftSidebar && "-translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-mane-primary">Components</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <RoomParameters onGenerate={generateInitialLayout} />
      </div>

      {/* Toggle button for left sidebar */}
      {!showLeftSidebar && (
        <Button
          className="fixed left-4 top-4 z-10"
          onClick={() => setShowLeftSidebar(true)}
        >
          Show Components
        </Button>
      )}

      {/* Main Canvas Area */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <RoomCanvas
            rooms={rooms}
            selectedRoom={selectedRoom}
            dimensions={dimensions}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={cn(
        "fixed right-4 top-4 bg-white p-4 shadow-lg rounded-lg transition-transform duration-300 z-10",
        !showRightSidebar && "translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-mane-primary">Parameters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {selectedRoom && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mane-primary mb-1">
                Room Type
              </label>
              <Input value={selectedRoom.type} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-mane-primary mb-1">
                Width (ft)
              </label>
              <Input
                type="number"
                value={selectedRoom.width}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  if (newWidth <= 0) return;
                  
                  if (selectedRoom.x + newWidth > dimensions.width) {
                    toast({
                      title: "Error",
                      description: "New width exceeds house dimensions",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const updatedRooms = rooms.map(room => 
                    room.id === selectedRoom.id 
                      ? { ...room, width: newWidth }
                      : room
                  );
                  setRooms(updatedRooms);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mane-primary mb-1">
                Length (ft)
              </label>
              <Input
                type="number"
                value={selectedRoom.length}
                onChange={(e) => {
                  const newLength = Number(e.target.value);
                  if (newLength <= 0) return;
                  
                  if (selectedRoom.y + newLength > dimensions.length) {
                    toast({
                      title: "Error",
                      description: "New length exceeds house dimensions",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const updatedRooms = rooms.map(room => 
                    room.id === selectedRoom.id 
                      ? { ...room, length: newLength }
                      : room
                  );
                  setRooms(updatedRooms);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toggle button for right sidebar */}
      {!showRightSidebar && (
        <Button
          className="fixed right-4 top-4 z-10"
          onClick={() => setShowRightSidebar(true)}
        >
          Show Parameters
        </Button>
      )}
    </div>
  );
};

export default Playground;