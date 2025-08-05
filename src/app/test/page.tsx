"use client";
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';

function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Màu nền xám đậm

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Add model (box)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      clippingPlanes: [],
      clipShadows: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Clipping planes
    const planes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 1),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 1),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 1),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), 1),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 1),
    ];
    material.clippingPlanes = planes;

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} />
  );
}

export default Page;
