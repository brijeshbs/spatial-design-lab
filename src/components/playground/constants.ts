export const ROOM_TYPES = {
  "Master Bedroom": { width: 16, length: 14 },
  "Second Bedroom": { width: 14, length: 12 },
  "Children's Room": { width: 12, length: 10 },
  "Living Room": { width: 20, length: 16 },
  "Kitchen": { width: 12, length: 10 },
  "Bathroom": { width: 8, length: 6 },
  "Balcony": { width: 10, length: 6 },
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