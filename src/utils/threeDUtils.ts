import * as THREE from 'three';
import { ROOM_COLORS } from '@/components/playground/constants';
import { Room } from '@/components/playground/types';

export const setupScene = (
  scene: THREE.Scene,
  dimensions: { width: number; length: number }
) => {
  scene.background = new THREE.Color(0xf0f0f0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(dimensions.width / 2, dimensions.length * 1.5, dimensions.length);
  scene.add(directionalLight);

  // Grid helper
  const gridHelper = new THREE.GridHelper(
    Math.max(dimensions.width, dimensions.length),
    Math.max(dimensions.width, dimensions.length)
  );
  gridHelper.position.set(dimensions.width / 2, 0, dimensions.length / 2);
  scene.add(gridHelper);
};

export const createWall = (
  width: number,
  height: number,
  depth: number,
  position: THREE.Vector3,
  color: number = 0x403E43
) => {
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  const wallMaterial = new THREE.MeshStandardMaterial({ color });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.copy(position);
  return wall;
};

export const createWindow = (
  width: number,
  height: number,
  depth: number,
  position: THREE.Vector3,
  rotation: number = 0
) => {
  const windowGeometry = new THREE.BoxGeometry(width, height, depth);
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xD3E4FD });
  const window = new THREE.Mesh(windowGeometry, windowMaterial);
  window.position.copy(position);
  window.rotation.y = rotation;
  return window;
};

export const createDoor = (
  width: number = 3,
  height: number = 2,
  depth: number = 0.2,
  position: THREE.Vector3
) => {
  const doorGeometry = new THREE.BoxGeometry(width, height, depth);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.copy(position);
  return door;
};