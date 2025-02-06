import { ScrollArea } from "@/components/ui/scroll-area";
import { RoomSelector } from "./RoomSelector";
import { validateTotalRoomArea } from "@/utils/roomUtils";

interface RoomSelectionManagerProps {
  selectedRoomTypes: string[];
  onToggleRoom: (roomType: string) => void;
  onRemoveRoom: (index: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RoomSelectionManager = ({
  selectedRoomTypes,
  onToggleRoom,
  onRemoveRoom,
  open,
  setOpen
}: RoomSelectionManagerProps) => {
  return (
    <ScrollArea className="flex-1 w-full pr-4">
      <RoomSelector
        selectedRoomTypes={selectedRoomTypes}
        onToggleRoom={onToggleRoom}
        onRemoveRoom={onRemoveRoom}
        open={open}
        setOpen={setOpen}
      />
    </ScrollArea>
  );
};