export const ROOM_TYPES = {
  "Master Bedroom": { width: 12, length: 10 },
  "Second Bedroom": { width: 10, length: 8 },
  "Children's Room": { width: 8, length: 8 },
  "Living Room": { width: 14, length: 12 },
  "Kitchen": { width: 10, length: 8 },
  "Bathroom": { width: 6, length: 5 },
  "Balcony": { width: 8, length: 4 },
} as const;

export const ROOM_COLORS = {
  "Master Bedroom": "#9b87f5",  // Primary Purple
  "Second Bedroom": "#FEC6A1",  // Soft Orange
  "Children's Room": "#D3E4FD", // Soft Blue
  "Living Room": "#F2FCE2",     // Soft Green
  "Kitchen": "#FFDEE2",         // Soft Pink
  "Bathroom": "#E5DEFF",        // Soft Purple
  "Balcony": "#FEF7CD",        // Soft Yellow
} as const;

export const COMPONENTS = {
  // Structural components
  "Wall": { width: 0.5, length: 4, color: "#403E43" },
  "Door": { width: 3, length: 0.5, color: "#8A898C" },
  "Window": { width: 3, length: 0.5, color: "#D3E4FD" },
  
  // Furniture and appliances
  "Table": { width: 4, length: 3, color: "#FEC6A1" },
  "Chair": { width: 2, length: 2, color: "#FDE1D3" },
  "TV": { width: 4, length: 1, color: "#1EAEDB" },
  "Refrigerator": { width: 3, length: 2.5, color: "#E5DEFF" },
  "Washing Machine": { width: 2.5, length: 2.5, color: "#FFDEE2" },
  "Bed": { width: 6, length: 4, color: "#F2FCE2" },
  "Sofa": { width: 6, length: 3, color: "#FEF7CD" },
} as const;