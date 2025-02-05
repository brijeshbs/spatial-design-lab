import * as THREE from 'three';
import { createWall, createDoor } from '@/utils/threeDUtils';

export const createPlotStructure = (
  scene: THREE.Scene,
  dimensions: { width: number; length: number }
) => {
  const wallHeight = 2.5;
  const wallThickness = 0.2;

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.length);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    side: THREE.DoubleSide
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(dimensions.width / 2, 0, dimensions.length / 2);
  scene.add(floor);

  // Plot walls
  scene.add(createWall(dimensions.width, wallHeight, wallThickness,
    new THREE.Vector3(dimensions.width / 2, wallHeight / 2, 0)));
  
  scene.add(createWall(dimensions.width, wallHeight, wallThickness,
    new THREE.Vector3(dimensions.width / 2, wallHeight / 2, dimensions.length)));
  
  scene.add(createWall(wallThickness, wallHeight, dimensions.length,
    new THREE.Vector3(0, wallHeight / 2, dimensions.length / 2)));
  
  scene.add(createWall(wallThickness, wallHeight, dimensions.length,
    new THREE.Vector3(dimensions.width, wallHeight / 2, dimensions.length / 2)));

  // Plot door
  scene.add(createDoor(3, 2, wallThickness,
    new THREE.Vector3(dimensions.width - 1.5, 1, dimensions.length)));
};