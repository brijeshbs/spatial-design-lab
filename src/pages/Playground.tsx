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

const DEFAULT_ROOM_SIZES = {
  "Master Bedroom": { width: 16, length: 14 },
  "Second Bedroom": { width: 14, length: 12 },
  "Children's Room": { width: 12, length: 10 },
  "Living Room": { width: 20, length: 16 },
  Kitchen: { width: 12, length: 10 },
  Bathroom: { width: 8, length: 6 },
  Balcony: { width: 10, length: 6 },
};

const Playground = () => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateInitialLayout = (dimensions: { width: number; length: number }) => {
    setDimensions(dimensions);
    const newRooms: Room[] = [];
    let currentX = 0;
    let currentY = 0;

    // Try to fit rooms in a grid pattern
    Object.entries(DEFAULT_ROOM_SIZES).forEach(([type, size]) => {
      // Check if room fits in current row
      if (currentX + size.width > dimensions.width) {
        currentX = 0;
        currentY += size.length;
      }
      
      // Check if room fits in house
      if (currentY + size.length <= dimensions.length) {
        newRooms.push({
          id: Math.random().toString(36).substr(2, 9),
          type,
          width: size.width,
          length: size.length,
          x: currentX,
          y: currentY,
        });
        currentX += size.width;
      } else {
        toast({
          title: "Warning",
          description: `${type} couldn't fit in the layout`,
          variant: "destructive",
        });
      }
    });

    setRooms(newRooms);
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
      ctx.fillStyle = selectedRoom?.id === room.id ? "#3498DB33" : "#2C3E5033";
      ctx.fillRect(
        room.x * gridSize,
        room.y * gridSize,
        room.width * gridSize,
        room.length * gridSize
      );
      ctx.strokeStyle = "#2C3E50";
      ctx.lineWidth = 2;
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
    });
  }, [rooms, selectedRoom, dimensions]);

  return (
    <div className="min-h-screen bg-mane-background flex">
      {/* Left Sidebar - Components */}
      <div className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold text-mane-primary mb-4">Components</h2>
        <RoomParameters onGenerate={generateInitialLayout} />
        <div className="space-y-2 mt-4">
          {Object.keys(DEFAULT_ROOM_SIZES).map((roomType) => (
            <Button
              key={roomType}
              onClick={() => {
                const defaultSize = DEFAULT_ROOM_SIZES[roomType as keyof typeof DEFAULT_ROOM_SIZES];
                const totalArea = rooms.reduce((sum, room) => sum + room.width * room.length, 0);
                const newRoomArea = defaultSize.width * defaultSize.length;
                
                if (totalArea + newRoomArea > dimensions.width * dimensions.length) {
                  toast({
                    title: "Error",
                    description: "Not enough space for new room",
                    variant: "destructive",
                  });
                  return;
                }
                
                const newRoom: Room = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: roomType,
                  ...defaultSize,
                  x: 0,
                  y: 0,
                };
                setRooms([...rooms, newRoom]);
              }}
              className="w-full justify-start"
              variant="outline"
            >
              {roomType}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-mane-grid rounded"
            onClick={(e) => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const gridSize = 20;
              
              // Find clicked room
              const clickedRoom = rooms.find(room => {
                const roomX = room.x * gridSize;
                const roomY = room.y * gridSize;
                const roomWidth = room.width * gridSize;
                const roomLength = room.length * gridSize;
                
                return x >= roomX && x <= roomX + roomWidth && 
                       y >= roomY && y <= roomY + roomLength;
              });
              
              setSelectedRoom(clickedRoom || null);
            }}
          />
        </div>
      </div>

      {/* Right Sidebar - Parameters */}
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