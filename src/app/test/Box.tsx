"use client";
import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function Box({ isMeasuring }: { isMeasuring: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  const [markerPositions, setMarkerPositions] = useState<THREE.Vector3[]>([]);

  // useFrame((_, delta) => {
  //   ref.current.rotation.x += delta
  // })

 const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isMeasuring) return
    e.stopPropagation()
    const newPoint = e.point.clone()
    setMarkerPositions((prev) => [...prev, newPoint])
  }
  return (
    <>
      {/* Object chính */}
      <mesh
        ref={ref}
        onClick={handleClick}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>

      {/* Marker điểm chấm */}
      {markerPositions.map((pos, index) => (
        <group key={index} position={pos}>
          <mesh>
            <sphereGeometry args={[0.02, 20, 20]} />
            <meshStandardMaterial color="red" />
          </mesh>

          <Html
            position={[0, 0.1, 0]}
            center
            style={{
              background: "white",
              padding: "2px 5px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {`${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`}
          </Html>
        </group>
      ))}

      {/* Line + khoảng cách */}
      {markerPositions.map((pos, index) => {
        if (index === 0) return null;
        const from = markerPositions[index - 1];
        const to = pos;
        const points = [from, to];
        const distance = from.distanceTo(to);
        const mid = new THREE.Vector3()
          .addVectors(from, to)
          .multiplyScalar(0.5);

        return (
          <group key={`line-${index}`}>
            {/* Đoạn nối 2 điểm */}
            <primitive
              object={
                new THREE.Line(
                  new THREE.BufferGeometry().setFromPoints([from, to]),
                  new THREE.LineBasicMaterial({ color: "red" })
                )
              }
            />

            {/* Hiện khoảng cách */}
            <Html
              position={mid}
              center
              style={{
                background: "black",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {distance.toFixed(2)} m
            </Html>
          </group>
        );
      })}
    </>
  );
}
