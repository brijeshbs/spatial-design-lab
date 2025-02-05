import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { RoomParameters } from "@/components/RoomParameters";
import { Compass, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

const ROOM_COLORS = {
  "Master Bedroom": "#9b87f5",  // Primary Purple
  "Second Bedroom": "#FEC6A1",  // Soft Orange
  "Children's Room": "#D3E4FD", // Soft Blue
  "Living Room": "#F2FCE2",     // Soft Green
  "Kitchen": "#FFDEE2",         // Soft Pink
  "Bathroom": "#E5DEFF",        // Soft Purple
  "Balcony": "#FEF7CD",        // Soft Yellow
};

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
            case 'left':
              const newWidthFromLeft = resizeHandle.startWidth - deltaX / gridSize;
              if (newWidthFromLeft >= 5) {
                newWidth = newWidthFromLeft;
                newX = resizeHandle.startRoomX + deltaX / gridSize;
              }
              break;
            case 'top':
              const newLengthFromTop = resizeHandle.startHeight - deltaY / gridSize;
              if (newLengthFromTop >= 5) {
                newLength = newLengthFromTop;
                newY = resizeHandle.startRoomY + deltaY / gridSize;
              }
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw infinite grid background
    const gridSize = 20;
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 0.5;

    // Calculate grid offset to create infinite effect
    const offsetX = (window.scrollX % gridSize);
    const offsetY = (window.scrollY % gridSize);

    // Draw vertical lines
    for (let x = -offsetX; x <= canvas.width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = -offsetY; y <= canvas.height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw plot outline with measurements
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, dimensions.width * gridSize, dimensions.length * gridSize);
    
    // Draw plot dimensions
    ctx.fillStyle = "#2C3E50";
    ctx.font = "12px Inter";
    ctx.fillText(`${dimensions.width} ft`, dimensions.width * gridSize / 2 - 20, -5);
    ctx.fillText(`${dimensions.length} ft`, -25, dimensions.length * gridSize / 2);

    // Draw rooms with their measurements
    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      const roomColor = ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || "#E2E8F0";
      
      // Draw room
      ctx.fillStyle = roomColor;
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );
      
      // Draw room border
      ctx.strokeStyle = isSelected ? "#3498DB" : "#2C3E50";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );

      // Draw room label and dimensions
      ctx.fillStyle = "#2C3E50";
      ctx.font = "12px Inter";
      ctx.fillText(
        `${room.type} (${room.width}' × ${room.length}')`,
        room.x * gridSize + 5,
        room.y * gridSize + 20
      );

      // Draw measurements
      ctx.fillText(
        `${room.width} ft`,
        room.x * gridSize + (room.width * gridSize / 2) - 15,
        room.y * gridSize - 5
      );
      ctx.fillText(
        `${room.length} ft`,
        room.x * gridSize - 25,
        room.y * gridSize + (room.length * gridSize / 2)
      );

      if (isSelected) {
        const handleSize = 8;
        ctx.fillStyle = "#3498DB";
        
        // Corner handles
        [
          [0, 0],                           // Top-left
          [room.width * gridSize, 0],       // Top-right
          [0, room.length * gridSize],      // Bottom-left
          [room.width * gridSize, room.length * gridSize] // Bottom-right
        ].forEach(([hx, hy]) => {
          ctx.fillRect(
            room.x * gridSize + hx - handleSize/2,
            room.y * gridSize + hy - handleSize/2,
            handleSize,
            handleSize
          );
        });

        // Edge handles
        [
          [room.width * gridSize / 2, 0],                    // Top
          [room.width * gridSize, room.length * gridSize / 2], // Right
          [room.width * gridSize / 2, room.length * gridSize], // Bottom
          [0, room.length * gridSize / 2]                    // Left
        ].forEach(([hx, hy]) => {
          ctx.fillRect(
            room.x * gridSize + hx - handleSize/2,
            room.y * gridSize + hy - handleSize/2,
            handleSize,
            handleSize
          );
        });
      }
    });

    // Draw compass
    const compassSize = 60;
    const compassX = canvas.width - compassSize - 20;
    const compassY = canvas.height - compassSize - 20;
    
    // Draw compass circle
    ctx.beginPath();
    ctx.arc(compassX, compassY, compassSize/2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw compass needle
    ctx.beginPath();
    ctx.moveTo(compassX, compassY + compassSize/3);
    ctx.lineTo(compassX, compassY - compassSize/3);
    ctx.strokeStyle = "#E74C3C";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw N indicator
    ctx.fillStyle = "#2C3E50";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("N", compassX, compassY - compassSize/2 - 5);

  }, [rooms, selectedRoom, dimensions]);

  return (
    <div className="min-h-screen bg-mane-background relative overflow-hidden">
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
