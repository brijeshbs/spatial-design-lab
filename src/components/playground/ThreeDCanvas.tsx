import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Room, Component } from './types';
import { createPlotStructure } from './three/PlotStructure';
import { createRoomStructure } from './three/RoomStructure';
import { SceneSetup } from './three/SceneSetup';
import { ComponentRenderer } from './three/ComponentRenderer';

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

  const handleSceneReady = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
  ) => {
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    createPlotStructure(scene, dimensions);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  useEffect(() => {
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const existingMeshes = sceneRef.current.children.filter(
      child => child instanceof THREE.Mesh && 
      (child.userData.isRoom || child.userData.isComponent)
    );
    existingMeshes.forEach(mesh => sceneRef.current?.remove(mesh));

    rooms.forEach(room => {
      createRoomStructure(sceneRef.current!, room, selectedRoom, dimensions);
    });

    components.forEach(component => {
      if (sceneRef.current) {
        return <ComponentRenderer scene={sceneRef.current} component={component} />;
      }
    });
  }, [rooms, selectedRoom, dimensions, components]);

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

  return (
    <div ref={mountRef} className="w-full h-full">
      <SceneSetup
        dimensions={dimensions}
        mountRef={mountRef}
        onSceneReady={handleSceneReady}
      />
    </div>
  );
};