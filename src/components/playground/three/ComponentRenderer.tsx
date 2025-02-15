
import * as THREE from 'three';
import { Component } from '../types';
import { COMPONENTS } from '../constants';

interface ComponentRendererProps {
  scene: THREE.Scene;
  component: Component;
}

type ThreeDObject = THREE.Mesh | THREE.Group;

const createFurnitureMesh = (type: string, width: number, length: number): ThreeDObject => {
  const componentConfig = COMPONENTS[type as keyof typeof COMPONENTS];
  const height = 1; // Default height for 3D objects

  switch (type) {
    case "Ceiling Fan": {
      const group = new THREE.Group();
      
      // Base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      group.add(base);

      // Blades
      for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.1, 0.2),
          new THREE.MeshStandardMaterial({ color: componentConfig.color })
        );
        blade.position.y = 0.1;
        blade.rotation.y = (Math.PI / 2) * i;
        group.add(blade);
      }
      return group;
    }

    case "Wall": {
      return new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 2, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
    }

    case "Door": {
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 2, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      door.position.y = height;
      return door;
    }

    case "Window": {
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, length),
        new THREE.MeshStandardMaterial({ 
          color: componentConfig.color,
          transparent: true,
          opacity: 0.6
        })
      );
      window.position.y = height;
      return window;
    }

    case "Table": {
      const group = new THREE.Group();
      
      // Table top
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.1, length),
        new THREE.MeshStandardMaterial({ color: componentConfig.color })
      );
      top.position.y = height * 0.7;
      group.add(top);

      // Legs
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
