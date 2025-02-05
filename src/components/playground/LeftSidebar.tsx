import { Button } from "@/components/ui/button";
import { RoomParameters } from "@/components/RoomParameters";
import { ComponentSelector } from "./ComponentSelector";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Component } from "./types";

interface LeftSidebarProps {
  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  onGenerate: (params: { width: number; length: number; roomTypes: string[] }) => void;
  onComponentSelect: (component: Component) => void;
}

export const LeftSidebar = ({
  showLeftSidebar,
  setShowLeftSidebar,
  onGenerate,
  onComponentSelect,
}: LeftSidebarProps) => {
  const [showComponents, setShowComponents] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed left-4 top-4 bg-white p-4 shadow-lg rounded-lg transition-transform duration-300 z-10 w-72",
          !showLeftSidebar && "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-mane-primary">
            {showComponents ? "Components" : "Room Parameters"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={showComponents ? "outline" : "default"}
            onClick={() => setShowComponents(false)}
            className="flex-1"
          >
            Rooms
          </Button>
          <Button
            variant={showComponents ? "default" : "outline"}
            onClick={() => setShowComponents(true)}
            className="flex-1"
          >
            Components
          </Button>
        </div>

        {showComponents ? (
          <ComponentSelector onSelect={onComponentSelect} />
        ) : (
          <RoomParameters onGenerate={onGenerate} />
        )}
      </div>

      {!showLeftSidebar && (
        <Button
          className="fixed left-4 top-4 z-10"
          onClick={() => setShowLeftSidebar(true)}
        >
          Show Components
        </Button>
      )}
    </>
  );
};