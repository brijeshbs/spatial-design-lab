import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomParametersProps {
  onGenerate: (dimensions: { width: number; length: number; roomTypes: string[] }) => void;
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

export const RoomParameters = ({ onGenerate }: RoomParametersProps) => {
  const [dimensions, setDimensions] = useState({ width: 30, length: 40 });
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(["Living Room"]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Calculate total area and number of possible rooms
  const totalArea = dimensions.width * dimensions.length;
  const averageRoomArea = Object.values(ROOM_TYPES).reduce((sum, room) => sum + (room.width * room.length), 0) / Object.keys(ROOM_TYPES).length;
  const suggestedRoomCount = Math.floor(totalArea / averageRoomArea);

  const handleToggleRoom = (roomType: string) => {
    let newRoomTypes: string[];
    
    if (selectedRoomTypes.includes(roomType)) {
      // Don't allow removing Living Room as it's required
      if (roomType === "Living Room") {
        toast({
          title: "Cannot Remove Living Room",
          description: "Living Room is required and cannot be removed.",
          variant: "destructive",
        });
        return;
      }
      newRoomTypes = selectedRoomTypes.filter(type => type !== roomType);
    } else {
      newRoomTypes = [...selectedRoomTypes, roomType];
    }
    
    setSelectedRoomTypes(newRoomTypes);
    
    // Calculate total area of selected rooms
    const totalRoomArea = newRoomTypes.reduce((sum, type) => {
      const room = ROOM_TYPES[type as keyof typeof ROOM_TYPES];
      return sum + (room.width * room.length);
    }, 0);

    if (totalRoomArea > totalArea) {
      toast({
        title: "Warning",
        description: "Total room area exceeds house dimensions. Some rooms may not fit.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = () => {
    if (dimensions.width < 20 || dimensions.length < 20) {
      setError("Minimum dimensions are 20x20 ft");
      return;
    }
    if (dimensions.width > 100 || dimensions.length > 100) {
      setError("Maximum dimensions are 100x100 ft");
      return;
    }
    if (selectedRoomTypes.length === 0) {
      setError("Please select at least one room type");
      return;
    }
    setError(null);
    onGenerate({ ...dimensions, roomTypes: selectedRoomTypes });
    toast({
      title: "Floor Plan Generated",
      description: `Created with dimensions ${dimensions.width}x${dimensions.length} ft and ${selectedRoomTypes.length} rooms`,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold">House Parameters</h3>
      
      <div className="space-y-2">
        <Label htmlFor="width">Width (ft)</Label>
        <Input
          id="width"
          type="number"
          value={dimensions.width}
          onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
          min={20}
          max={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="length">Length (ft)</Label>
        <Input
          id="length"
          type="number"
          value={dimensions.length}
          onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
          min={20}
          max={100}
        />
      </div>

      <div className="space-y-2">
        <Label>Suggested Number of Rooms</Label>
        <div className="text-sm text-gray-600">
          Based on your dimensions, we suggest {suggestedRoomCount} rooms
        </div>
      </div>

      <div className="space-y-2">
        <Label>Select Room Types</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              Select rooms...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search room types..." />
              <CommandList>
                <CommandEmpty>No room type found.</CommandEmpty>
                <CommandGroup>
                  {Object.keys(ROOM_TYPES).map((roomType) => (
                    <CommandItem
                      key={roomType}
                      value={roomType}
                      onSelect={() => handleToggleRoom(roomType)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRoomTypes.includes(roomType) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {roomType}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Selected Rooms</Label>
        <div className="flex flex-wrap gap-2">
          {selectedRoomTypes.map((type) => (
            <div
              key={type}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{type}</span>
              {type !== "Living Room" && (
                <button
                  onClick={() => handleToggleRoom(type)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleGenerate} className="w-full">
        Generate Floor Plan
      </Button>
    </div>
  );
};