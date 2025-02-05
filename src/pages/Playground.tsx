import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { RoomParameters } from "@/components/RoomParameters";

interface Room {
  id: string;
  type: string;
  width: number;
  length: number;
  x: number;
  y: number;
}

interface ResizeHandle {
  room: Room;
  edge: 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startRoomX: number;
  startRoomY: number;
}

const ROOM_TYPES = {
  "Master Bedroom": { width: 16, length: 14 },
  "Second Bedroom": { width: 14, length: 12 },
  "Children's Room": { width: 12, length: 10 },
  "Living Room": { width: 20, length: 16 },
  "Kitchen": { width: 12, length: 10 },
  "Bathroom": { width: 8, length: 6 },
  "Balcony": { width: 10, length: 6 },
};

const Playground = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const gridSize = 20;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing && resizeHandle) {
      const deltaX = x - resizeHandle.startX;
      const deltaY = y - resizeHandle.startY;

      const newRooms = rooms.map(room => {
        if (room.id === resizeHandle.room.id) {
          let newWidth = room.width;
          let newLength = room.length;

          if (resizeHandle.edge.includes('right')) {
            newWidth = Math.max(5, resizeHandle.startWidth + Math.floor(deltaX / gridSize));
          }
          if (resizeHandle.edge.includes('bottom')) {
            newLength = Math.max(5, resizeHandle.startHeight + Math.floor(deltaY / gridSize));
          }

          return {
            ...room,
            width: Math.min(newWidth, dimensions.width - room.x),
            length: Math.min(newLength, dimensions.length - room.y),
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    const gridSize = 20;
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw house outline
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, dimensions.width * gridSize, dimensions.length * gridSize);

    // Draw rooms
    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      
      // Draw room
      ctx.fillStyle = isSelected ? "#3498DB33" : "#2C3E5033";
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );
      
      // Draw room border
      ctx.strokeStyle = "#2C3E50";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );

      // Draw room label
      ctx.fillStyle = "#2C3E50";
      ctx.font = "12px Inter";
      ctx.fillText(
        room.type,
        room.x * gridSize + 5,
        room.y * gridSize + 20
      );

      // Draw resize handles if room is selected
      if (isSelected) {
        const handleSize = 4;
        ctx.fillStyle = "#3498DB";
        
        // Corner handles
        ctx.fillRect(room.x * gridSize - handleSize, room.y * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect((room.x + room.width) * gridSize - handleSize, room.y * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect(room.x * gridSize - handleSize, (room.y + room.length) * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect((room.x + room.width) * gridSize - handleSize, (room.y + room.length) * gridSize - handleSize, handleSize * 2, handleSize * 2);
        
        // Edge handles
        ctx.fillRect((room.x + room.width/2) * gridSize - handleSize, room.y * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect((room.x + room.width) * gridSize - handleSize, (room.y + room.length/2) * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect((room.x + room.width/2) * gridSize - handleSize, (room.y + room.length) * gridSize - handleSize, handleSize * 2, handleSize * 2);
        ctx.fillRect(room.x * gridSize - handleSize, (room.y + room.length/2) * gridSize - handleSize, handleSize * 2, handleSize * 2);
      }
    });
  }, [rooms, selectedRoom, dimensions]);

  return (
    <div className="min-h-screen bg-mane-background flex">
      <div className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold text-mane-primary mb-4">Components</h2>
        <RoomParameters onGenerate={generateInitialLayout} />
      </div>

      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-mane-grid rounded cursor-move"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </div>
      </div>

      <div className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold text-mane-primary mb-4">Parameters</h2>
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
    </div>
  );
};

export default Playground;