// components/ModelViewer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import * as OBC from "@thatopen/components";
import { Potree, PointCloudOctree } from "potree-core";
import { ModelType } from "@/models/enums";
import { Html } from "@react-three/drei";

export default function ModelViewer({
  model,
  onLoad,
  isDistant,
   isVisible,
}: {
  model: any;
  onLoad: (type: ModelType, ref: THREE.Object3D) => void;
  isDistant: any;
   isVisible: boolean; 
}) {
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const { camera, gl } = useThree();
  const potree = new Potree();
  const [markerPositions, setMarkerPositions] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!isDistant || !isVisible) return;

    const handleClick = (event: MouseEvent) => {
      const bounds = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(groupRef.current, true);
      if (intersects.length > 0) {
        const point = intersects[0].point.clone();
        setMarkerPositions((prev) => [...prev, point]);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [isDistant, gl, camera]);

  useEffect(() => {
    const loadModel = async () => {
      const components = new OBC.Components();
      components.init();

      if (model.type === ModelType.IFC) {
        //Load IFC
        const ifcLoader = components.get(OBC.IfcLoader);
        await ifcLoader.setup({
          autoSetWasm: false,
          wasm: {
            path: "https://unpkg.com/web-ifc@0.0.69/",
            absolute: true,
          },
        });
        const githubUrl =
          "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
        const workerBlob = await (await fetch(githubUrl)).blob();
        const workerFile = new File([workerBlob], "worker.mjs", {
          type: "text/javascript",
        });
        const workerUrl = URL.createObjectURL(workerFile);
        const fragments = components.get(OBC.FragmentsManager);
        fragments.init(workerUrl);
        const buffer = new Uint8Array(
          await (await fetch(model.mainLink)).arrayBuffer()
        );
        await ifcLoader.load(buffer, false, "model-ifc");
        const loadedModel = fragments.list.get("model-ifc");
        if (loadedModel) {
          loadedModel.useCamera(camera);
          groupRef.current.add(loadedModel.object);
          fragments.core.update(true);
          onLoad(ModelType.IFC, groupRef.current);
        }
      } else if (model.type === ModelType.PointCloud) {
        // Load PointCloud
        try {
          const cloud = await potree.loadPointCloud(
            "/metadata.json",
            model.mainLink
          );
          cloud.position.set(model.x || 0, model.y || 0, model.z || 0);
          cloud.rotation.x = -Math.PI / 2;
          groupRef.current.add(cloud);
          onLoad(ModelType.PointCloud, groupRef.current);
          // Update point cloud in render loop
          const animate = () => {
            if (cloud && camera && gl) {
              potree.updatePointClouds([cloud], camera, gl);
            }
            requestAnimationFrame(animate);
          };

          animate();
        } catch (e) {
          console.error("Fail loading:", e);
        }
      }
    };

    loadModel();
  }, [model, camera, gl]);

 return (
    <>
      <primitive object={groupRef.current} />

      {/* Hiển thị marker + line nếu đang visible */}
      {isVisible && (
        <>
          {markerPositions.map((pos, index) => (
            <group key={`marker-${index}`} position={pos}>
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

          {/* Line + số đo khoảng cách */}
          {markerPositions.map((pos, index) => {
            if (index === 0) return null;
            const from = markerPositions[index - 1];
            const to = pos;
            const distance = from.distanceTo(to);
            const mid = new THREE.Vector3()
              .addVectors(from, to)
              .multiplyScalar(0.5);

            return (
              <group key={`line-${index}`}>
                <primitive
                  object={
                    new THREE.Line(
                      new THREE.BufferGeometry().setFromPoints([from, to]),
                      new THREE.LineBasicMaterial({ color: "red" })
                    )
                  }
                />
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
      )}
    </>
  );
}
