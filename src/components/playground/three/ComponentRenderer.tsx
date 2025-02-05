import * as THREE from 'three';
import { Component } from '../types';
import { COMPONENTS } from '../constants';

interface ComponentRendererProps {
  scene: THREE.Scene;
  component: Component;
}

const getComponentHeight = (type: string): number => {
  switch (type) {
    case "Ceiling Fan":
    case "Ceiling Light":
    case "Chandelier":
    case "Track Light":
      return 2.4; // Near ceiling
    case "Wall Fan":
    case "Wall Light":
    case "Air Conditioner":
      return 1.8; // Wall height
    case "Floor Lamp":
      return 0.5; // On floor
    case "Table":
      return 0.7;
    case "Chair":
      return 0.5;
    case "Bed":
      return 0.4;
    case "Sofa":
      return 0.4;
    default:
      return 0;
  }
};

export const ComponentRenderer = ({ scene, component }: ComponentRendererProps) => {
  const componentConfig = COMPONENTS[component.type as keyof typeof COMPONENTS];
  if (!componentConfig) return null;

  let geometry;
  const material = new THREE.MeshStandardMaterial({ 
    color: componentConfig.color,
    metalness: 0.2,
    roughness: 0.8
  });

  switch (component.type) {
    case "Staircase":
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        1.5,
        componentConfig.length
      );
      break;
    case "Wall":
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        2.5,
        componentConfig.length
      );
      break;
    case "Door":
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        2,
        componentConfig.length
      );
      break;
    case "Window":
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        1.5,
        componentConfig.length
      );
      break;
    case "Ceiling Fan":
    case "Wall Fan":
      geometry = new THREE.CylinderGeometry(
        componentConfig.width / 2,
        componentConfig.width / 2,
        0.2,
        32
      );
      break;
    case "Air Conditioner":
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        0.8,
        componentConfig.length
      );
      break;
    case "Ceiling Light":
    case "Wall Light":
    case "Floor Lamp":
      geometry = new THREE.SphereGeometry(0.3, 32, 32);
      material.emissive = new THREE.Color(0xffff00);
      material.emissiveIntensity = 0.5;
      break;
    case "Chandelier":
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      material.emissive = new THREE.Color(0xffff00);
      material.emissiveIntensity = 0.8;
      break;
    case "Track Light":
      geometry = new THREE.CylinderGeometry(0.2, 0.2, componentConfig.width, 32);
      material.emissive = new THREE.Color(0xffff00);
      material.emissiveIntensity = 0.5;
      break;
    default:
      geometry = new THREE.BoxGeometry(
        componentConfig.width,
        1,
        componentConfig.length
      );
  }

  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.position.set(
    component.x + componentConfig.width / 2,
    getComponentHeight(component.type),
    component.y + componentConfig.length / 2
  );
  
  mesh.rotation.y = (component.rotation * Math.PI) / 180;
  
  mesh.userData.isComponent = true;
  mesh.userData.componentId = component.id;
  scene.add(mesh);

  return null;
};