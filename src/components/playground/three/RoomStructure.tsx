import * as THREE from 'three';
import { Room } from '@/components/playground/types';
import { ROOM_COLORS } from '@/components/playground/constants';
import { createWall, createWindow, createDoor } from '@/utils/threeDUtils';

export const createRoomStructure = (
  scene: THREE.Scene,
  room: Room,
  selectedRoom: Room | null,
  dimensions: { width: number; length: number }
) => {
  const wallHeight = 2.5;
  const wallThickness = 0.2;

  // Room walls
  const walls = [
    // Front wall
    createWall(room.width, wallHeight, wallThickness,
      new THREE.Vector3(room.x + room.width / 2, wallHeight / 2, room.y)),
    // Back wall
    createWall(room.width, wallHeight, wallThickness,
      new THREE.Vector3(room.x + room.width / 2, wallHeight / 2, room.y + room.length)),
    // Left wall
    createWall(wallThickness, wallHeight, room.length,
      new THREE.Vector3(room.x, wallHeight / 2, room.y + room.length / 2)),
    // Right wall
    createWall(wallThickness, wallHeight, room.length,
      new THREE.Vector3(room.x + room.width, wallHeight / 2, room.y + room.length / 2))
  ];

  walls.forEach(wall => {
    wall.material = new THREE.MeshStandardMaterial({
      color: ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || 0xcccccc,
      transparent: true,
      opacity: selectedRoom?.id === room.id ? 1 : 0.8,
    });
    wall.userData.isRoom = true;
    wall.userData.roomId = room.id;
    scene.add(wall);
  });

  // Add windows
  scene.add(createWindow(3, 1, wallThickness,
    new THREE.Vector3(
      room.x + room.width / 2,
      wallHeight / 2,
      room.y
    )
  ));

  scene.add(createWindow(3, 1, wallThickness,
    new THREE.Vector3(
      room.x,
      wallHeight / 2,
      room.y + room.length / 2
    ),
    Math.PI / 2
  ));

  // Add doors based on room type
  if (room.type !== "Living Room") {
    scene.add(createDoor(3, 2, wallThickness,
      new THREE.Vector3(
        room.x + room.width - 1.5,
        1,
        room.y + room.length
      )
    ));
  } else {
    // Living Room door alongside plot door
    scene.add(createDoor(3, 2, wallThickness,
      new THREE.Vector3(
        dimensions.width - 4.5,
        1,
        dimensions.length
      )
    ));
  }
};