import * as THREE from 'three';
import { Component } from '../types';
import { COMPONENTS } from '../constants';

interface ComponentRendererProps {
  scene: THREE.Scene;
  component: Component;
}

const createFurnitureMesh = (type: string, width: number, length: number): THREE.Mesh | THREE.Group => {
  const componentConfig = COMPONENTS[type as keyof typeof COMPONENTS];
  const height = type === 'Wall' ? 2.5 : 1; // Walls are taller than furniture

  switch (type) {
    case "Table": {
      const group = new THREE.Group();
      
      // Table top
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.1, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      top.position.y = height * 0.7;
      group.add(top);

      // Table legs
      const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, height * 0.7, 8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      
      [-width/2 + 0.2, width/2 - 0.2].forEach(x => {
        [-length/2 + 0.2, length/2 - 0.2].forEach(z => {
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          leg.position.set(x, height * 0.35, z);
          group.add(leg);
        });
      });
      
      return group;
    }

    case "Chair": {
      const group = new THREE.Group();
      
      // Seat
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.1, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      seat.position.y = height * 0.5;
      group.add(seat);

      // Back
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      back.position.set(0, height * 0.75, length/2);
      group.add(back);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, height * 0.5, 8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      
      [-width/2 + 0.1, width/2 - 0.1].forEach(x => {
        [-length/2 + 0.1, length/2 - 0.1].forEach(z => {
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          leg.position.set(x, height * 0.25, z);
          group.add(leg);
        });
      });

      return group;
    }

    case "Bed": {
      const group = new THREE.Group();
      
      // Mattress
      const mattress = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.4, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      mattress.position.y = height * 0.2;
      group.add(mattress);

      // Headboard
      const headboard = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.8, 0.2),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      headboard.position.set(0, height * 0.4, length/2);
      group.add(headboard);

      return group;
    }

    case "Sofa": {
      const group = new THREE.Group();
      
      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.4, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      base.position.y = height * 0.2;
      group.add(base);

      // Back
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.6, 0.3),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      back.position.set(0, height * 0.5, length/2 - 0.15);
      group.add(back);

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.3, height * 0.6, length);
      const armMaterial = new THREE.MeshStandardMaterial({ color: componentConfig.color });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-width/2 + 0.15, height * 0.3, 0);
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(width/2 - 0.15, height * 0.3, 0);
      group.add(rightArm);

      return group;
    }

    case "TV": {
      const group = new THREE.Group();
      
      // Screen
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.6, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      screen.position.y = height;
      group.add(screen);

      // Stand
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, height, 8),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      stand.position.y = height * 0.5;
      group.add(stand);

      return group;
    }

    case "Refrigerator": {
      return new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 2, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
    }

    default: {
      // Default box for other components
      return new THREE.Mesh(
        new THREE.BoxGeometry(width, height, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
    }
  }
};

export const ComponentRenderer = ({ scene, component }: ComponentRendererProps) => {
  const object = createFurnitureMesh(
    component.type,
    component.width,
    component.length
  );

  // Position the object
  object.position.set(
    component.x + component.width / 2,
    0, // Start at ground level
    component.y + component.length / 2
  );
  
  // Apply rotation
  object.rotation.y = (component.rotation * Math.PI) / 180;
  
  // Add metadata
  object.userData.isComponent = true;
  object.userData.componentId = component.id;
  
  // Add to scene
  scene.add(object);

  return null;
};