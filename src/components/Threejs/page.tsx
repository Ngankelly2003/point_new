"use client";

import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointCloudOctree, Potree } from "potree-core";
import * as OBC from "@thatopen/components";
import { Button, Drawer, Slider, Switch } from "antd/lib";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getModels } from "@/store/actions/models.action";
import { useParams } from "next/navigation";
import { SettingOutlined } from "@ant-design/icons";
import { AppContext } from "@/context/AppContext";

export default function ThreeJSPage() {
  const worldRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D[]>([]);
  const pointCloudsRef = useRef<PointCloudOctree[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { setLoading } = useContext(AppContext);
  const params = useParams();
  const id = params.id as string;
  const [pointSize, setPointSize] = useState(0.1);
  const [opacity, setOpacity] = useState({
    model: 1,
    pointcloud: 1,
  });
  const [open, setOpen] = useState(false);
  const potree = new Potree();
  potree.pointBudget = 2_000_000;
  let currentOffset = 0;
  const spacing = 50;

  const updatePointSize = (size: number) => {
    pointCloudsRef.current.forEach((pc) => {
      pc.material.size = size;
      pc.material.needsUpdate = true;
    });
  };

  const setOpacityRecursive = (object: THREE.Object3D, opacity: number) => {
    object.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat: any) => {
          mat.transparent = true;
          mat.opacity = opacity;
          mat.depthWrite = opacity === 1;
          mat.needsUpdate = true;
        });
      }
    });
  };

  const updateOpacity = (type: "model" | "pointcloud", opacity: number) => {
    if (type === "model") {
      modelRef.current.forEach((model) => {
        setOpacityRecursive(model, opacity);
      });
    }
    if (type === "pointcloud") {
      pointCloudsRef.current.forEach((pc) => {
        if (pc.material) {
          pc.material.transparent = true;
          pc.material.opacity = opacity;
          pc.material.needsUpdate = true;
        }
      });
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const init = async () => {
      const container = containerRef.current!;
      const components = new OBC.Components();
      const worlds = components.get(OBC.Worlds);
      const world = worlds.create<
        OBC.SimpleScene,
        OBC.SimpleCamera,
        OBC.SimpleRenderer
      >();
      worldRef.current = world;
      world.scene = new OBC.SimpleScene(components);
      world.scene.setup();

      world.renderer = new OBC.SimpleRenderer(components, container);
      world.camera = new OBC.SimpleCamera(components);
      await world.camera.controls.setLookAt(200, 100, 150, -100, -100, -20);

      components.init();

      // Helpers
      const gridHelper = new THREE.GridHelper(200, 10, 0xffffff, 0xffffff);
      gridHelper.material.opacity = 1;
      gridHelper.material.transparent = false;
      world.scene.three.add(gridHelper);

      const axesHelper = new THREE.AxesHelper(50);
      world.scene.three.add(axesHelper);

      // Setup IFC loader
      const ifcLoader = components.get(OBC.IfcLoader);
      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: "https://unpkg.com/web-ifc@0.0.69/",
          absolute: true,
        },
      });

      // Setup fragments
      const githubUrl =
        "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
      const fetchedUrl = await fetch(githubUrl);
      const workerBlob = await fetchedUrl.blob();
      const workerFile = new File([workerBlob], "worker.mjs", {
        type: "text/javascript",
      });
      const workerUrl = URL.createObjectURL(workerFile);
      const fragments = components.get(OBC.FragmentsManager);
      fragments.init(workerUrl);

      world.camera.controls.addEventListener("rest", () =>
        fragments.core.update(true)
      );
      world.onCameraChanged.add((camera) => {
        for (const [, model] of fragments.list) {
          model.useCamera(camera.three);
        }
        fragments.core.update(true);
      });

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);
        modelRef.current.push(model.object);
        model.object.position.set(0, 0.05, 0);
        fragments.core.update(true);

        updateOpacity("model", opacity.model);
      });

      const fitGridToModels = () => {
        const box = new THREE.Box3();

        modelRef.current.forEach((model) => box.expandByObject(model));
        pointCloudsRef.current.forEach((pc) => box.expandByObject(pc));

        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.z);
        const center = box.getCenter(new THREE.Vector3());

        const newGrid = new THREE.GridHelper(
          maxSize * 2,
          20,
          0xffffff,
          0xffffff
        );
        newGrid.material.transparent = true;
        newGrid.material.opacity = 1;
        newGrid.position.set(center.x, 0, center.z);

        world.scene.three.children = world.scene.three.children.filter(
          (obj) => !(obj instanceof THREE.GridHelper)
        );

        world.scene.three.add(newGrid);
      };

      // Load IFC
      const loadIfc = async (path: string, index: number) => {
        const file = await fetch(path);
        const data = await file.arrayBuffer();
        const buffer = new Uint8Array(data);
        await ifcLoader.load(buffer, false, `model-${index}`, {
          processData: {
            progressCallback: (progress) =>
              console.log(`Progress model ${index}:`, progress),
          },
        });
        const model = modelRef.current[modelRef.current.length - 1];
        if (model) {
          currentOffset -= spacing;
          model.position.set(currentOffset, 0, 0);
        }
      };

      // Load PointCloud
      const loadPointCloudFromUrl = async (
        cloudBaseUrl: string,
        x?: number,
        y?: number,
        z?: number
      ) => {
        try {
          const pointcloud = await potree.loadPointCloud(
            "/metadata.json",
            cloudBaseUrl
          );
          pointcloud.position.set(currentOffset, 0, 0);
          currentOffset -= spacing;

          world.scene.three.add(pointcloud);
          pointCloudsRef.current.push(pointcloud);
          pointcloud.rotation.x = -Math.PI / 2;
          updateOpacity("pointcloud", opacity.pointcloud);
        } catch (err) {
          console.error("Không thể load PointCloud:", err);
        }
      };

      const loopPoint = () => {
        if (world.renderer) {
          potree.updatePointClouds(
            pointCloudsRef.current,
            world.camera.three,
            world.renderer.three
          );
        }
        requestAnimationFrame(loopPoint);
      };
      loopPoint();

      const fetchAndLoadIFCFiles = async () => {
        setLoading(true);
        try {
          const response = await dispatch(getModels(id)).unwrap();
          const models = response.result.modelFiles;
          for (let i = 0; i < models.length; i++) {
            const model = models[i];

            if (model.type === 1) {
              await loadIfc(model.mainLink, i);
            }

            if (model.type === 0) {
              const cloudJsUrl = model.mainLink;
              await loadPointCloudFromUrl(
                cloudJsUrl,
                model.x,
                model.y,
                model.z
              );
            }
          }
        } catch (error) {
          console.error("Lỗi khi tải model từ API:", error);
        } finally {
          setLoading(false);
        }
      };

      await fetchAndLoadIFCFiles();
      fitGridToModels();
    };

    init();
  }, []);

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <Button
          icon={<SettingOutlined />}
          type="primary"
          onClick={() => setOpen(true)}
        >
          Menu
        </Button>
      </div>

      {/* Drawer menu setting */}
      <Drawer
        title="Setting"
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width={300}
      >
        <div style={{ marginBottom: 16 }}>
          <Switch
            defaultChecked
            onChange={(checked) => {
              modelRef.current.forEach((model) => (model.visible = checked));
            }}
          />{" "}
          <span style={{ marginLeft: 8 }}>IFC</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Switch
            defaultChecked
            onChange={(checked) => {
              pointCloudsRef.current.forEach((pc) => (pc.visible = checked));
            }}
          />{" "}
          <span style={{ marginLeft: 8 }}>PointCloud</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <span>Kích thước điểm</span>
          <Slider
            min={0.1}
            max={10}
            step={0.1}
            value={pointSize}
            onChange={(value) => {
              setPointSize(value);
              updatePointSize(value);
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <span>Độ mờ IFC</span>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={opacity.model}
            onChange={(value) => {
              setOpacity((prev) => ({ ...prev, model: value }));
              updateOpacity("model", value);
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <span>Độ mờ PointCloud</span>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={opacity.pointcloud}
            onChange={(value) => {
              setOpacity((prev) => ({ ...prev, pointcloud: value }));
              updateOpacity("pointcloud", value);
            }}
          />
        </div>

        <Button
          block
          type="primary"
          onClick={() => {
            if (worldRef.current) {
              worldRef.current.camera.fitToItems();
            }
          }}
        >
          Fit Model
        </Button>
      </Drawer>

      {/* Container ThreeJS */}
      <div
        id="container"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          position: "relative",
        }}
      />
    </>
  );
}
