import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from '@/utils/threeDUtils';

interface SceneSetupProps {
  dimensions: { width: number; length: number };
  mountRef: React.RefObject<HTMLDivElement>;
  onSceneReady: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls) => void;
}

export const SceneSetup = ({ dimensions, mountRef, onSceneReady }: SceneSetupProps) => {
  if (!mountRef.current) return null;

  const scene = new THREE.Scene();
  setupScene(scene, dimensions);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(dimensions.width / 2, dimensions.length * 1.5, dimensions.length);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  mountRef.current.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  onSceneReady(scene, camera, renderer, controls);

  return null;
};