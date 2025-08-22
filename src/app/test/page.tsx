"use client";
import styles from "./viewer.module.scss";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Grid,
  GizmoHelper,
  OrbitControls,
  GizmoViewcube,
} from "@react-three/drei";

import { useEffect, useRef, useState } from "react";
import { getModels } from "@/store/actions/models.action";
import { AppDispatch } from "@/store";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import ModelViewer from "./LoadModel";
import { Button, Drawer, Switch } from "antd/lib";
import { SettingOutlined } from "@ant-design/icons";
import { ModelType } from "@/models/enums";
import Box from "./Box";

export default function ViewerPage() {
  const [models, setModels] = useState<any[]>([]);
  const [isDistant, setIsDistant] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<any>();
  const [open, setOpen] = useState(false);
  const modelRefs = useRef<{ type: ModelType; ref: THREE.Object3D }[]>([]);

  const [visibleState, setVisibleState] = useState({
    ifc: true,
    point: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getModels(id)).unwrap();
      setModels(response.result.modelFiles);
    };
    fetchData();
  }, []);

  const toggleVisibility = (type: ModelType, visible: boolean) => {
    modelRefs.current.forEach((model) => {
      if (model.type === type) {
        model.ref.visible = visible;
      }
    });
  };
  const handleModelLoad = (type: ModelType, ref: THREE.Object3D) => {
    modelRefs.current.push({ type, ref });
  };
  return (
    <main
      style={{ width: "100vw", height: "100vh" }}
      className={styles.wrapper}
    >
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {models.map((m: any, idx: number) => (
          <group key={idx} position={[idx * 10, 0, 0]}>
            <ModelViewer
              model={m}
              onLoad={handleModelLoad}
              isDistant={isDistant}
              isVisible={
                m.type === ModelType.IFC ? visibleState.ifc : visibleState.point
              }
            />
          </group>
        ))}
        {/* <Box  /> */}
        <Grid
          position={[0, -0.01, 0]}
          args={[100, 100]}
          cellSize={0}
          cellThickness={0.5}
          cellColor="#000000"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#ffff"
          fadeDistance={1000}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
          side={THREE.DoubleSide}
        />
        <OrbitControls />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <Button
          icon={<SettingOutlined />}
          type="primary"
          onClick={() => setOpen(true)}
        >
          Menu
        </Button>
        <Drawer
          title="Setting"
          placement="left"
          open={open}
          onClose={() => setOpen(false)}
          width={300}
        >
          <div style={{ marginBottom: 16 }}>
            <label>IFC Models</label>
            <br />
            <Switch
              checked={visibleState.ifc}
              onChange={(checked) => {
                setVisibleState((prev) => ({ ...prev, ifc: checked }));
                toggleVisibility(ModelType.IFC, checked);
              }}
            />
          </div>

          <div>
            <label>PointCloud Models</label>
            <br />
            <Switch
              checked={visibleState.point}
              onChange={(checked) => {
                setVisibleState((prev) => ({ ...prev, point: checked }));
                toggleVisibility(ModelType.PointCloud, checked);
              }}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Đo khoảng cách</label>
            <br />
            <Button
              onClick={() => setIsDistant((prev) => !prev)}
              style={{
                backgroundColor: isDistant ? "#ff4d4f" : "#4caf50", // đỏ khi bật, xanh khi tắt
                color: "#fff",
                border: "none",
                marginTop: 8,
              }}
              danger={isDistant}
              block
            >
              {isDistant ? "Off" : "On"}
            </Button>
          </div>
        </Drawer>
      </div>
    </main>
  );
}

// "use client";
// import styles from "./viewer.module.scss";
// import * as THREE from "three";
// import { Canvas } from "@react-three/fiber";
// import {
//   Grid,
//   GizmoHelper,
//   OrbitControls,
//   GizmoViewcube,
// } from "@react-three/drei";
// import Box from "./Box";
// import { useState } from "react";

// export default function ViewerPage() {
//   const [isMeasuring, setIsMeasuring] = useState(false);
//   return (
//     <main
//       style={{ width: "100vw", height: "100vh" }}
//       className={styles.wrapper}
//     >
//       <Canvas>
//         <ambientLight intensity={Math.PI / 2} />
//         <spotLight
//           position={[10, 10, 10]}
//           angle={0.15}
//           penumbra={1}
//           decay={0}
//           intensity={Math.PI}
//         />
//         <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
//         <Box isMeasuring={isMeasuring} />

//         <Grid
//           position={[0, -0.01, 0]}
//           args={[100, 100]}
//           cellSize={0}
//           cellThickness={0.5}
//           cellColor="#000000"
//           sectionSize={1}
//           sectionThickness={1}
//           sectionColor="#ffff"
//           fadeDistance={1000}
//           fadeStrength={1}
//           followCamera={false}
//           infiniteGrid={false}
//           side={THREE.DoubleSide}
//         />
//         <OrbitControls />
//         <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
//           <GizmoViewcube />
//         </GizmoHelper>
//       </Canvas>
//       <button
//         onClick={() => setIsMeasuring((prev) => !prev)}
//         style={{
//           position: "absolute",
//           zIndex: 10,
//           top: 20,
//           left: 20,
//           padding: "10px 15px",
//           fontSize: "14px",
//           background: isMeasuring ? "#ff5959" : "#4caf50",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         {isMeasuring ? "Tắt đo khoảng cách" : "Bật đo khoảng cách"}
//       </button>
//     </main>
//   );
// }
