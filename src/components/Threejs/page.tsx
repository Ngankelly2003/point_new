"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Potree, PointCloudOctree } from "@pnext/three-loader";
import * as OBC from "@thatopen/components";
import { Switch } from "antd/lib";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getModels } from "@/store/actions/models.action";
import { useParams } from "next/navigation";

export default function ThreeJSPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.id as string;
  
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

      world.scene = new OBC.SimpleScene(components);
      world.scene.setup();
      // world.scene.three.background = null;

      world.renderer = new OBC.SimpleRenderer(components, container);
      world.camera = new OBC.OrthoPerspectiveCamera(components);
      await world.camera.controls.setLookAt(78, 50, -50, 26, 14, -25);

      components.init();

      const gridHelper = new THREE.GridHelper(200);
      gridHelper.position.set(0, 0, 0);
      world.scene.three.add(gridHelper);

      const axesHelper = new THREE.AxesHelper(50);
      axesHelper.position.set(0, 0, 0);
      world.scene.three.add(axesHelper);

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

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);
        modelRef.current = model.object;
        model.object.position.set(0, 0.05, 0);
        fragments.core.update(true);
      });

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
      };
      const fetchAndLoadIFCFiles = async () => {
        try {
          const response = await dispatch(getModels(id)).unwrap();
          const models = response.result.modelFiles;

          for (let i = 0; i < models.length; i++) {
            await loadIfc(models[i].mainLink, i);
          }
        } catch (error) {
          console.error("Lỗi khi tải IFC từ API:", error);
        }
      };

      await fetchAndLoadIFCFiles();
    };

    init();
  }, []);

  return (
    <div
      id="container"
      ref={containerRef}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <div style={{ marginTop: 8 }}>
        <span style={{ marginRight: 8 }}>IFC</span>
        <Switch
          defaultChecked
          onChange={(checked) => {
            if (modelRef.current) {
              modelRef.current.visible = checked;
            }
          }}
        />
      </div>
    </div>
  );
}
