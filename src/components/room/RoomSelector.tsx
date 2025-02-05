import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROOM_TYPES } from "@/components/playground/constants";
import { Label } from "@/components/ui/label";
import { handleLivingRoomModification } from "@/utils/roomUtils";

interface RoomSelectorProps {
  selectedRoomTypes: string[];
  onToggleRoom: (roomType: string) => void;
  onRemoveRoom: (index: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RoomSelector = ({ 
  selectedRoomTypes, 
  onToggleRoom, 
  onRemoveRoom, 
  open, 
  setOpen 
}: RoomSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Add Room Types</Label>
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
                    onSelect={() => onToggleRoom(roomType)}
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

      <div className="space-y-2">
        <Label>Selected Rooms</Label>
        <div className="flex flex-wrap gap-2">
          {selectedRoomTypes.map((type, index) => (
            <div
              key={`${type}-${index}`}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{type}</span>
              {type !== "Living Room" && (
                <button
                  onClick={() => onRemoveRoom(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};