import { useState } from "react";
import { ResizeHandle } from "@/components/playground/types";

export const useResizeState = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  return {
    isResizing,
    setIsResizing,
    resizeHandle,
    setResizeHandle,
  };
};