import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Room } from './types';
import { ROOM_COLORS } from './constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
      const wallHeight = 2.5; // 8 feet walls
      const geometry = new THREE.BoxGeometry(room.width, wallHeight, room.length);
      const material = new THREE.MeshStandardMaterial({
        color: ROOM_COLORS[room.type as keyof typeof ROOM_COLORS] || 0xcccccc,
        transparent: true,
        opacity: 0.8,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        room.x + room.width / 2,
        wallHeight / 2,
        room.y + room.length / 2
      );
      mesh.userData.isRoom = true;
      mesh.userData.roomId = room.id;

      if (selectedRoom?.id === room.id) {
        material.opacity = 1;
        material.emissive = new THREE.Color(0x666666);
      }

      sceneRef.current?.add(mesh);
    });
  }, [rooms, selectedRoom]);

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