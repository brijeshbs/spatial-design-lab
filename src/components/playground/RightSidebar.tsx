import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Room } from "./types";
import { toast } from "@/components/ui/use-toast";

interface RightSidebarProps {
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  onUpdateRoom: (updatedRoom: Room) => void;
}

export const RightSidebar = ({
  showRightSidebar,
  setShowRightSidebar,
  selectedRoom,
  dimensions,
  onUpdateRoom,
}: RightSidebarProps) => {
  return (
    <>
      <div
        className={cn(
          "fixed right-4 top-4 bg-white p-4 shadow-lg rounded-lg transition-transform duration-300 z-10",
          !showRightSidebar && "translate-x-full"
        )}
      >
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
                  
                  onUpdateRoom({ ...selectedRoom, width: newWidth });
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
                  
                  onUpdateRoom({ ...selectedRoom, length: newLength });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {!showRightSidebar && (
        <Button
          className="fixed right-4 top-4 z-10"
          onClick={() => setShowRightSidebar(true)}
        >
          Show Parameters
        </Button>
      )}
    </>
  );
};