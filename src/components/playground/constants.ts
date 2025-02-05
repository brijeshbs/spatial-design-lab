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