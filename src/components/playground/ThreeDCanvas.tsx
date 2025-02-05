import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Room } from './types';
import { ROOM_COLORS } from './constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    scene.background = new THREE.Color(0xf0f0f0);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(dimensions.width / 2, dimensions.length * 1.5, dimensions.length);
    scene.add(directionalLight);

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
    const wallHeight = 2.5;
    const wallThickness = 0.2;
    
    // Create plot walls
    const createWall = (width: number, height: number, depth: number, position: THREE.Vector3) => {
      const wallGeometry = new THREE.BoxGeometry(width, height, depth);
      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x403E43 });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.copy(position);
      scene.add(wall);
    };

    // Front wall
    createWall(dimensions.width, wallHeight, wallThickness, 
      new THREE.Vector3(dimensions.width / 2, wallHeight / 2, 0));
    
    // Back wall
    createWall(dimensions.width, wallHeight, wallThickness,
      new THREE.Vector3(dimensions.width / 2, wallHeight / 2, dimensions.length));
    
    // Left wall
    createWall(wallThickness, wallHeight, dimensions.length,
      new THREE.Vector3(0, wallHeight / 2, dimensions.length / 2));
    
    // Right wall
    createWall(wallThickness, wallHeight, dimensions.length,
      new THREE.Vector3(dimensions.width, wallHeight / 2, dimensions.length / 2));

    // Plot door
    const plotDoorGeometry = new THREE.BoxGeometry(3, 2, wallThickness);
    const plotDoorMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
    const plotDoor = new THREE.Mesh(plotDoorGeometry, plotDoorMaterial);
    plotDoor.position.set(dimensions.width - 1.5, 1, dimensions.length);
    scene.add(plotDoor);

    // Grid helper
    const gridHelper = new THREE.GridHelper(Math.max(dimensions.width, dimensions.length), 
      Math.max(dimensions.width, dimensions.length));
    gridHelper.position.set(dimensions.width / 2, 0, dimensions.length / 2);
    scene.add(gridHelper);

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
      const wallHeight = 2.5;
      const wallThickness = 0.2;

      // Room walls
      const createRoomWall = (width: number, height: number, depth: number, position: THREE.Vector3) => {
        const wallGeometry = new THREE.BoxGeometry(width, height, depth);
        const wallMaterial = new THREE.MeshStandardMaterial({
          color: ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || 0xcccccc,
          transparent: true,
          opacity: selectedRoom?.id === room.id ? 1 : 0.8,
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.copy(position);
        wall.userData.isRoom = true;
        wall.userData.roomId = room.id;
        sceneRef.current?.add(wall);
      };

      // Create room walls
      createRoomWall(room.width, wallHeight, wallThickness,
        new THREE.Vector3(room.x + room.width / 2, wallHeight / 2, room.y));
      createRoomWall(room.width, wallHeight, wallThickness,
        new THREE.Vector3(room.x + room.width / 2, wallHeight / 2, room.y + room.length));
      createRoomWall(wallThickness, wallHeight, room.length,
        new THREE.Vector3(room.x, wallHeight / 2, room.y + room.length / 2));
      createRoomWall(wallThickness, wallHeight, room.length,
        new THREE.Vector3(room.x + room.width, wallHeight / 2, room.y + room.length / 2));

      // Add windows
      const windowWidth = 3;
      const windowHeight = 1;
      const windowDepth = wallThickness;
      const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
      const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xD3E4FD });

      // Top wall window
      const topWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      topWindow.position.set(
        room.x + room.width / 2,
        wallHeight / 2,
        room.y
      );
      sceneRef.current?.add(topWindow);

      // Left wall window
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.rotation.y = Math.PI / 2;
      leftWindow.position.set(
        room.x,
        wallHeight / 2,
        room.y + room.length / 2
      );
      sceneRef.current?.add(leftWindow);

      // Add door (except for Living Room)
      if (room.type !== "Living Room") {
        const doorGeometry = new THREE.BoxGeometry(3, 2, wallThickness);
        const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x2C3E50 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(
          room.x + room.width - 1.5,
          1,
          room.y + room.length
        );
        sceneRef.current?.add(door);
      } else {
        // Living Room door alongside plot door
        const livingRoomDoor = new THREE.Mesh(
          new THREE.BoxGeometry(3, 2, wallThickness),
          new THREE.MeshStandardMaterial({ color: 0x2C3E50 })
        );
        livingRoomDoor.position.set(
          dimensions.width - 4.5,
          1,
          dimensions.length
        );
        sceneRef.current?.add(livingRoomDoor);
      }
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