import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Room } from './types';
import { setupScene } from '@/utils/threeDUtils';
import { createPlotStructure } from './three/PlotStructure';
import { createRoomStructure } from './three/RoomStructure';

interface ThreeDCanvasProps {
  rooms: Room[];
  selectedRoom: Room | null;
  dimensions: { width: number; length: number };
}

export const ThreeDCanvas = ({ rooms, selectedRoom, dimensions }: ThreeDCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

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

  // Update rooms when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing room meshes
    const roomMeshes = sceneRef.current.children.filter(
      child => child instanceof THREE.Mesh && child.userData.isRoom
    );
    roomMeshes.forEach(mesh => sceneRef.current?.remove(mesh));

    // Add new room meshes
    rooms.forEach(room => {
      createRoomStructure(sceneRef.current!, room, selectedRoom, dimensions);
    });
  }, [rooms, selectedRoom, dimensions]);

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