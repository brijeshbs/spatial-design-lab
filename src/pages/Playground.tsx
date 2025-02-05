import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

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

  const addRoom = (type: string) => {
    const defaultSize = DEFAULT_ROOM_SIZES[type as keyof typeof DEFAULT_ROOM_SIZES];
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      width: defaultSize.width,
      length: defaultSize.length,
      x: 0,
      y: 0,
    };

    // Check if room fits within house dimensions
    if (newRoom.width > dimensions.width || newRoom.length > dimensions.length) {
      toast({
        title: "Error",
        description: "Room dimensions exceed house dimensions",
        variant: "destructive",
      });
      return;
    }

    setRooms([...rooms, newRoom]);
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
  }, [rooms, selectedRoom]);

  return (
    <div className="min-h-screen bg-mane-background flex">
      {/* Left Sidebar - Components */}
      <div className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold text-mane-primary mb-4">Components</h2>
        <div className="space-y-2">
          {Object.keys(DEFAULT_ROOM_SIZES).map((roomType) => (
            <Button
              key={roomType}
              onClick={() => addRoom(roomType)}
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
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-mane-primary mb-1">
                Width (ft)
              </label>
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: Number(e.target.value) })
                }
                className="w-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mane-primary mb-1">
                Length (ft)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) =>
                  setDimensions({ ...dimensions, length: Number(e.target.value) })
                }
                className="w-32"
              />
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-mane-grid rounded"
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
                  // Implement room resize logic
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
                  // Implement room resize logic
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