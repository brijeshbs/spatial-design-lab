export interface Room {
  id: string;
  type: string;
  width: number;
  length: number;
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ResizeHandle {
  room: Room;
  edge: 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startRoomX: number;
  startRoomY: number;
}