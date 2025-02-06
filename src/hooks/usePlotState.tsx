import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const usePlotState = () => {
  const [dimensions, setDimensions] = useState({ width: 100, length: 100 });
  const [showPlot, setShowPlot] = useState(false);

  return {
    dimensions,
    setDimensions,
    showPlot,
    setShowPlot,
  };
};