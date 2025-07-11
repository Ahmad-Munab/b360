"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GlobeProps {
  className?: string;
  globeConfig?: {
    pointSize?: number;
    globeColor?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    emissive?: string;
    emissiveIntensity?: number;
    shininess?: number;
    polygonColor?: string;
    ambientLight?: string;
    directionalLeftLight?: string;
    directionalTopLight?: string;
    pointLight?: string;
    arcTime?: number;
    arcLength?: number;
    rings?: number;
    maxRings?: number;
    initialPosition?: { lat: number; lng: number };
    autoRotate?: boolean;
    autoRotateSpeed?: number;
  };
  data?: Array<{
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
  }>;
}

export function Globe({ className = "", globeConfig = {} }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    const config = {
      pointSize: 1,
      globeColor: "#1e3a8a",
      showAtmosphere: true,
      atmosphereColor: "#3b82f6",
      atmosphereAltitude: 0.15,
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#ffffff",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 22.3193, lng: 114.1694 },
      autoRotate: true,
      autoRotateSpeed: 0.5,
      ...globeConfig,
    };

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountElement.appendChild(renderer.domElement);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: config.globeColor,
      emissive: config.emissive,
      emissiveIntensity: config.emissiveIntensity,
      shininess: config.shininess,
      transparent: true,
      opacity: 0.9,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add atmosphere
    if (config.showAtmosphere) {
      const atmosphereGeometry = new THREE.SphereGeometry(5.2, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: config.atmosphereColor,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
    }

    // Add points for locations
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions: number[] = [];

    // Add some sample points for major cities
    const cities = [
      { lat: 41.8781, lng: -87.6298 }, // Chicago
      { lat: 14.5995, lng: 120.9842 }, // Manila
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 53.3498, lng: -6.2603 }, // Dublin
    ];

    cities.forEach((city) => {
      const phi = (90 - city.lat) * (Math.PI / 180);
      const theta = (city.lng + 180) * (Math.PI / 180);

      const x = -(5.1 * Math.sin(phi) * Math.cos(theta));
      const z = 5.1 * Math.sin(phi) * Math.sin(theta);
      const y = 5.1 * Math.cos(phi);

      pointsPositions.push(x, y, z);
    });

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pointsPositions, 3)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      color: "#60a5fa",
      size: 0.1,
      sizeAttenuation: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Lighting
    const ambientLight = new THREE.AmbientLight(config.ambientLight, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      config.directionalLeftLight,
      0.6
    );
    directionalLight.position.set(-1, 0, 1);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(
      config.directionalTopLight,
      0.4
    );
    directionalLight2.position.set(0, 1, 0);
    scene.add(directionalLight2);

    // Camera position
    camera.position.z = 15;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (config.autoRotate) {
        globe.rotation.y += config.autoRotateSpeed * 0.01;
        points.rotation.y += config.autoRotateSpeed * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountElement) return;

      camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [globeConfig]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
}
