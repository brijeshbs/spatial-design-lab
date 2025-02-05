import * as THREE from 'three';
import { Component } from '../types';
import { COMPONENTS } from '../constants';

interface ComponentRendererProps {
  scene: THREE.Scene;
  component: Component;
}

const createFurnitureMesh = (type: string, width: number, length: number): THREE.Mesh => {
  let geometry: THREE.BufferGeometry;
  let material: THREE.Material;
  const componentConfig = COMPONENTS[type as keyof typeof COMPONENTS];

  switch (type) {
    case "Ceiling Fan":
      // Create fan blades and center
      const fanGroup = new THREE.Group();
      const centerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
      const centerMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      fanGroup.add(center);

      // Add blades
      for (let i = 0; i < 4; i++) {
        const bladeGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.3);
        const blade = new THREE.Mesh(bladeGeometry, centerMaterial);
        blade.position.x = 0.75;
        blade.rotation.y = (i * Math.PI) / 2;
        fanGroup.add(blade);
      }
      return fanGroup;

    case "Table":
      const tableGroup = new THREE.Group();
      // Table top
      const topGeometry = new THREE.BoxGeometry(width, 0.1, length);
      const tableMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      const top = new THREE.Mesh(topGeometry, tableMaterial);
      top.position.y = 0.7;
      tableGroup.add(top);

      // Table legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
      for (let x = -width/2 + 0.2; x <= width/2 - 0.2; x += width - 0.4) {
        for (let z = -length/2 + 0.2; z <= length/2 - 0.2; z += length - 0.4) {
          const leg = new THREE.Mesh(legGeometry, tableMaterial);
          leg.position.set(x, 0.35, z);
          tableGroup.add(leg);
        }
      }
      return tableGroup;

    case "Chair":
      const chairGroup = new THREE.Group();
      // Seat
      const seatGeometry = new THREE.BoxGeometry(width, 0.1, length);
      const chairMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      const seat = new THREE.Mesh(seatGeometry, chairMaterial);
      seat.position.y = 0.4;
      chairGroup.add(seat);

      // Back
      const backGeometry = new THREE.BoxGeometry(width, 0.6, 0.1);
      const back = new THREE.Mesh(backGeometry, chairMaterial);
      back.position.set(0, 0.7, length/2 - 0.05);
      chairGroup.add(back);

      // Legs
      const chairLegGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
      for (let x = -width/2 + 0.1; x <= width/2 - 0.1; x += width - 0.2) {
        for (let z = -length/2 + 0.1; z <= length/2 - 0.1; z += length - 0.2) {
          const leg = new THREE.Mesh(chairLegGeometry, chairMaterial);
          leg.position.set(x, 0.2, z);
          chairGroup.add(leg);
        }
      }
      return chairGroup;

    case "Bed":
      const bedGroup = new THREE.Group();
      // Mattress
      const mattressGeometry = new THREE.BoxGeometry(width, 0.3, length);
      const bedMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      const mattress = new THREE.Mesh(mattressGeometry, bedMaterial);
      mattress.position.y = 0.3;
      bedGroup.add(mattress);

      // Frame
      const frameGeometry = new THREE.BoxGeometry(width + 0.2, 0.1, length + 0.2);
      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.y = 0.15;
      bedGroup.add(frame);

      // Headboard
      const headboardGeometry = new THREE.BoxGeometry(width + 0.2, 0.8, 0.1);
      const headboard = new THREE.Mesh(headboardGeometry, frameMaterial);
      headboard.position.set(0, 0.55, length/2 + 0.05);
      bedGroup.add(headboard);
      return bedGroup;

    case "Sofa":
      const sofaGroup = new THREE.Group();
      // Base
      const baseGeometry = new THREE.BoxGeometry(width, 0.4, length);
      const sofaMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      const base = new THREE.Mesh(baseGeometry, sofaMaterial);
      base.position.y = 0.2;
      sofaGroup.add(base);

      // Back
      const sofaBackGeometry = new THREE.BoxGeometry(width, 0.6, 0.3);
      const sofaBack = new THREE.Mesh(sofaBackGeometry, sofaMaterial);
      sofaBack.position.set(0, 0.5, length/2 - 0.15);
      sofaGroup.add(sofaBack);

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.3, 0.5, length);
      const leftArm = new THREE.Mesh(armGeometry, sofaMaterial);
      leftArm.position.set(-width/2 + 0.15, 0.45, 0);
      sofaGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, sofaMaterial);
      rightArm.position.set(width/2 - 0.15, 0.45, 0);
      sofaGroup.add(rightArm);
      return sofaGroup;

    default:
      // Default box for other components
      geometry = new THREE.BoxGeometry(width, 0.5, length);
      material = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      return new THREE.Mesh(geometry, material);
  }
};

export const ComponentRenderer = ({ scene, component }: ComponentRendererProps) => {
  const mesh = createFurnitureMesh(
    component.type,
    component.width,
    component.length
  );

  if (mesh instanceof THREE.Group) {
    mesh.position.set(
      component.x + component.width / 2,
      0,
      component.y + component.length / 2
    );
  } else {
    mesh.position.set(
      component.x + component.width / 2,
      mesh.geometry.parameters.height / 2,
      component.y + component.length / 2
    );
  }
  
  mesh.rotation.y = (component.rotation * Math.PI) / 180;
  mesh.userData.isComponent = true;
  mesh.userData.componentId = component.id;
  scene.add(mesh);

  return null;
};