import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Room, Component } from './types';
import { setupScene } from '@/utils/threeDUtils';
import { createPlotStructure } from './three/PlotStructure';
import { createRoomStructure } from './three/RoomStructure';
import { COMPONENTS } from './constants';

interface ThreeDCanvasProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
  components: Component[];
}

export const ThreeDCanvas = ({ rooms, selectedRoom, dimensions, components }: ThreeDCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const createComponent3D = (scene: THREE.Scene, component: Component) => {
    const componentConfig = COMPONENTS[component.type as keyof typeof COMPONENTS];
    if (!componentConfig) return;

    let geometry;
    const material = new THREE.MeshStandardMaterial({ 
      color: componentConfig.color,
      metalness: 0.2,
      roughness: 0.8
    });

    // Create different geometries based on component type
    switch (component.type) {
      case "Staircase":
        geometry = new THREE.BoxGeometry(
          componentConfig.width,
          1.5, // Height for stairs
          componentConfig.length
        );
        break;
      case "Wall":
        geometry = new THREE.BoxGeometry(
          componentConfig.width,
          2.5, // Wall height
          componentConfig.length
        );
        break;
      case "Door":
        geometry = new THREE.BoxGeometry(
          componentConfig.width,
          2, // Door height
          componentConfig.length
        );
        break;
      case "Window":
        geometry = new THREE.BoxGeometry(
          componentConfig.width,
          1.5, // Window height
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
        // Default box geometry for furniture
        geometry = new THREE.BoxGeometry(
          componentConfig.width,
          1, // Default height
          componentConfig.length
        );
    }

    const mesh = new THREE.Mesh(geometry, material);
    
    // Position the component
    mesh.position.set(
      component.x + componentConfig.width / 2,
      getComponentHeight(component.type),
      component.y + componentConfig.length / 2
    );
    
    // Apply rotation
    mesh.rotation.y = (component.rotation * Math.PI) / 180;
    
    mesh.userData.isComponent = true;
    mesh.userData.componentId = component.id;
    scene.add(mesh);
  };

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

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    setupScene(scene, dimensions);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(dimensions.width / 2, dimensions.length * 1.5, dimensions.length);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;

    // Create plot structure
    createPlotStructure(scene, dimensions);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [dimensions]);

  // Update rooms and components when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing room and component meshes
    const existingMeshes = sceneRef.current.children.filter(
      child => child instanceof THREE.Mesh && 
      (child.userData.isRoom || child.userData.isComponent)
    );
    existingMeshes.forEach(mesh => sceneRef.current?.remove(mesh));

    // Add new room meshes
    rooms.forEach(room => {
      createRoomStructure(sceneRef.current!, room, selectedRoom, dimensions);
    });

    // Add new component meshes
    components.forEach(component => {
      createComponent3D(sceneRef.current!, component);
    });
  }, [rooms, selectedRoom, dimensions, components]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};